/**
 * Offline listing generator (ADR-0022, promotes ADR-0017).
 *
 * Generates Sojurno listings with OpenAI and writes them to Supabase:
 *   1. listing copy/metadata via OpenAI structured outputs (JSON schema)
 *   2. a hero image via gpt-image-1
 *   3. upload image → Supabase Storage (`listing-images`)
 *   4. bulk-insert `published` rows into `listings` (service-role key, bypasses RLS)
 *
 * This NEVER runs in the app — the browser reads a build-time export
 * (scripts/export-listings.ts → src/data/listings.generated.ts), keeping the app AI-free at
 * runtime (ADR-0010 / ADR-0017).
 *
 * Usage:
 *   npm run gen:listings -- --tenant runners --count 4 --images 1 --quality low
 *   npm run gen:listings -- --tenant hikers --count 2 --dry-run
 */
import 'dotenv/config'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'
import { CLIMBER_GEAR, HIKER_GEAR } from '../src/data/gear'
import type { ActiveTenantId, GearItem, Listing } from '../src/types'

// ── config / args ────────────────────────────────────────────────────────────────────────────
type Quality = 'low' | 'medium' | 'high'
const TEXT_MODEL = 'gpt-4o-mini' // copy/metadata — cheap, on-voice with a strong prompt
const IMAGE_MODEL = 'gpt-image-1'
const IMAGE_SIZE = '1024x1024'
const BUCKET = 'listing-images'

/** Rough USD/image for the cost estimate (gpt-image-1, 1024×1024). Confirm at openai.com/pricing. */
const IMAGE_COST: Record<Quality, number> = { low: 0.016, medium: 0.07, high: 0.19 }

function arg(name: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback
}
const hasFlag = (name: string) => process.argv.includes(`--${name}`)

const tenant = (arg('tenant', 'runners') as ActiveTenantId)
const count = Math.max(1, Number(arg('count', '4')))
const imagesPerListing = Math.max(0, Number(arg('images', '1')))
const quality = (arg('quality', 'low') as Quality)
const dryRun = hasFlag('dry-run')

if (tenant !== 'runners' && tenant !== 'hikers' && tenant !== 'climbers') {
  console.error(`✖ --tenant must be 'runners', 'hikers', or 'climbers' (got '${tenant}')`)
  process.exit(1)
}
if (!['low', 'medium', 'high'].includes(quality)) {
  console.error(`✖ --quality must be low | medium | high (got '${quality}')`)
  process.exit(1)
}

// ── env ────────────────────────────────────────────────────────────────────────────────────
const { OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env
function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    console.error(`✖ Missing ${name} — copy .env.example to .env and fill it in.`)
    process.exit(1)
  }
  return value
}

// ── per-tenant prompt flavor ─────────────────────────────────────────────────────────────────
const TENANT_BRIEF: Record<ActiveTenantId, string> = {
  runners:
    'a stay for distance runners traveling for a marathon, half, or training block. Real US running cities/neighborhoods. Hosts who know race logistics, shakeout routes, transit, taper. Practical, calm, race-week-aware.',
  hikers:
    'a stay near real US trailheads/national parks/wilderness for backpackers and day hikers. Hosts with local trail beta, weather judgment, gear to lend. Practical, warm, gateway-to-the-trail.',
  climbers:
    'a stay near real US climbing destinations (e.g. Bishop, Red River Gorge, Joshua Tree, Smith Rock, Index, the New River Gorge). Hosts who know the grades, crag aspects, approach beta, and have gear to lend. Practical, warm, dialed-for-the-alpine-start.',
}

// JSON schema for OpenAI structured outputs — the copy fields only (the script sets id, tenant,
// images, rating, reviewCount, gear, host avatar).
const LISTING_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'title', 'location', 'neighborhood', 'price',
    'hostName', 'hostBadge', 'hostBio', 'tags', 'amenities', 'highlight', 'description', 'imagePrompt',
  ],
  properties: {
    title: {
      type: 'string',
      description:
        'Lead with a CONCRETE noun — the property type plus a specific place or feature (e.g. ' +
        '"Back Bay brownstone two blocks from the marathon buses", "North Fork cabin gateway to ' +
        'Glacier NP trails"). ~6-12 words. NEVER open with a generic adjective (cozy, comfortable, ' +
        'charming, warm, rustic, serene, lovely, stunning, perfect, peaceful, inviting, quaint). ' +
        'No marketing hype, no "Retreat"/"Haven"/"Getaway" filler.',
    },
    location: { type: 'string', description: 'Real US "City, ST" matching the community. Vary cities across the batch.' },
    neighborhood: { type: 'string', description: 'Real neighborhood or area within that city.' },
    price: { type: 'integer', description: 'Nightly USD, 150-260.' },
    hostName: { type: 'string', description: 'A first name — distinct from every other listing in the batch; vary across cultures and genders.' },
    hostBadge: { type: 'string', description: 'Short credibility tag, e.g. "Marathon pacer", "Backcountry host".' },
    hostBio: { type: 'string', description: 'One sentence, warm, community-specific local knowledge.' },
    tags: { type: 'array', items: { type: 'string' }, description: 'Exactly 3 short chips.' },
    amenities: { type: 'array', items: { type: 'string' }, description: 'Exactly 3 practical amenities.' },
    highlight: { type: 'string', description: 'One sentence — the standout, community-specific.' },
    description: { type: 'string', description: '2-3 sentences. Belonging, trust, practical local context. No "lorem ipsum", no hype.' },
    imagePrompt: {
      type: 'string',
      description:
        'A prompt for a PHOTOREALISTIC interior/exterior real-estate photo of THIS stay (natural light, lived-in, no text/people/watermark). Reflects the location and vibe.',
    },
  },
} as const

// The whole batch is generated in ONE call (an array wrapped in an object — strict structured
// outputs needs an object root) so the model can actively diversify titles, host names, and
// neighborhoods across listings instead of converging on the same words call-to-call.
const BATCH_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['listings'],
  properties: {
    listings: { type: 'array', items: LISTING_SCHEMA },
  },
} as const

type GeneratedCopy = {
  title: string; location: string; neighborhood: string; price: number
  hostName: string; hostBadge: string; hostBio: string
  tags: string[]; amenities: string[]; highlight: string; description: string; imagePrompt: string
}

const SYSTEM_PROMPT =
  'You write listings for Sojurno, an affinity-based peer-to-peer stays marketplace ("stay with ' +
  'people who get why you\'re traveling"). Voice: clear, warm, quietly premium — a trusted stay ' +
  'marketplace, NOT an adventure brand. Specificity over adjectives: real cities, real ' +
  'races/trails/crags, concrete details a local would know. Never lorem ipsum, never hype, never ' +
  'generic filler words ("cozy", "comfortable", "charming", "retreat", "haven", "getaway", ' +
  '"oasis"). Match the voice of these real Sojurno titles:\n' +
  '  • "Back Bay brownstone two blocks from the marathon buses"\n' +
  '  • "Lakefront studio built around race-week calm"\n' +
  '  • "Portal cabin with bear canister and trail beta"\n' +
  '  • "North Fork cabin gateway to Glacier NP trails"'

// ── helpers ───────────────────────────────────────────────────────────────────────────────────
const rand = (min: number, max: number) => Math.random() * (max - min) + min
const initials = (name: string) =>
  name.trim().split(/\s+/).map((w) => w[0]?.toUpperCase() ?? '').slice(0, 2).join('') || 'SJ'
const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)
const suffix = () => Math.random().toString(36).slice(2, 6)

// ── main ──────────────────────────────────────────────────────────────────────────────────────
async function main() {
  const estImageCost = count * imagesPerListing * IMAGE_COST[quality]
  console.log(
    `\nPlan: ${count} ${tenant} listing(s) · ${imagesPerListing} image(s) each @ ${quality}\n` +
      `Est. image cost ≈ $${estImageCost.toFixed(2)} (text ≈ cents). ${dryRun ? '[DRY RUN]\n' : ''}`,
  )

  if (dryRun) {
    console.log(
      `[dry run] No API calls made, no credentials required. Would generate ${count} ${tenant} ` +
        `listing(s) with ${imagesPerListing} image(s) each.\n`,
    )
    return
  }

  const openai = new OpenAI({ apiKey: requireEnv(OPENAI_API_KEY, 'OPENAI_API_KEY') })
  const supabase = createClient(
    requireEnv(SUPABASE_URL, 'SUPABASE_URL'),
    requireEnv(SUPABASE_SERVICE_ROLE_KEY, 'SUPABASE_SERVICE_ROLE_KEY'),
  )

  // 1. all copy/metadata in ONE structured-outputs call so the batch self-diversifies.
  const completion = await openai.chat.completions.create({
    model: TEXT_MODEL,
    temperature: 1,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content:
          `Generate EXACTLY ${count} DISTINCT listings, each for ${TENANT_BRIEF[tenant]}\n\n` +
          'Hard rules for the batch:\n' +
          '- No two titles may share an opening word or sentence structure; lead each with a ' +
          'concrete property type + a specific place or feature, never a generic adjective.\n' +
          '- Every host name must be different (vary cultures/genders).\n' +
          '- Spread across different cities and neighborhoods — do not cluster.\n' +
          '- Each listing should feel like a different real place, not a reskin of the last.',
      },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: { name: 'listings', schema: BATCH_SCHEMA, strict: true },
    },
  })

  const parsed = JSON.parse(completion.choices[0]?.message?.content ?? '{}') as { listings?: GeneratedCopy[] }
  const copies = (parsed.listings ?? []).slice(0, count)
  if (copies.length === 0) throw new Error('OpenAI returned no listings')

  let inserted = 0
  for (const copy of copies) {
    const id = `${slugify(copy.location)}-${slugify(copy.title).split('-').slice(0, 2).join('-')}-${suffix()}`

    // 2 + 3. image(s) → Supabase Storage
    const images: { src: string; alt: string }[] = []
    for (let img = 0; img < imagesPerListing; img++) {
      const gen = await openai.images.generate({
        model: IMAGE_MODEL,
        prompt: copy.imagePrompt,
        size: IMAGE_SIZE,
        quality,
        n: 1,
      })
      const b64 = gen.data?.[0]?.b64_json
      if (!b64) throw new Error('OpenAI returned no image data')
      const buffer = Buffer.from(b64, 'base64')
      const path = `${tenant}/${id}-${img}.png`
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, buffer, { contentType: 'image/png', upsert: true })
      if (upErr) throw upErr
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path)
      images.push({ src: pub.publicUrl, alt: `${copy.title} — view ${img + 1}` })
    }

    // assemble the row (DB column shape; mirrors the Listing type)
    const gearPool = tenant === 'hikers' ? HIKER_GEAR : tenant === 'climbers' ? CLIMBER_GEAR : null
    const gear: GearItem[] | null = gearPool
      ? gearPool.slice(0, 2 + Math.floor(rand(0, gearPool.length - 1)))
      : null
    const row = {
      id,
      tenant_id: tenant,
      booking_mode: 'native' as const,
      external_url: null,
      title: copy.title,
      location: copy.location,
      neighborhood: copy.neighborhood,
      price: Math.round(copy.price),
      rating: Number(rand(4.88, 4.99).toFixed(2)),
      review_count: Math.round(rand(28, 112)),
      host: {
        name: copy.hostName,
        avatar: initials(copy.hostName),
        avatarUrl: `https://i.pravatar.cc/96?img=${Math.floor(rand(1, 70))}`,
        badge: copy.hostBadge,
        bio: copy.hostBio,
      },
      images,
      tags: copy.tags.slice(0, 3),
      amenities: copy.amenities.slice(0, 3),
      highlight: copy.highlight,
      description: copy.description,
      gear,
      status: 'published' as const,
      source: 'generated' as const,
    }

    const { error: insErr } = await supabase.from('listings').upsert(row)
    if (insErr) throw insErr
    inserted++
    console.log(`  ✓ ${row.id} — ${row.title} (${row.location})`)
  }

  console.log(
    `\nDone. Inserted ${inserted} listing(s). Run \`npm run export:listings\` to pull into the app.\n`,
  )
}

// Type-only reference so unused-import lint stays clean if Listing isn't otherwise used.
export type { Listing }

main().catch((err) => {
  console.error('\n✖ Generation failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
