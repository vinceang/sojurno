/**
 * One-time cleanup (ADR-0022 follow-up): rewrites the DESCRIPTIONS of existing GENERATED listings
 * that came out as AI slop ("Nestled in vibrant…, this cozy… perfect for…"). Loops the generated
 * rows and rewrites each description from its own context (title, place, highlight), updating only
 * the `description` column. Titles (already de-slopped), images, and seed listings are untouched.
 * Text-only (cents).
 *
 *   npx tsx scripts/reword-copy.ts            # apply
 *   npx tsx scripts/reword-copy.ts --dry-run  # preview, write nothing
 *
 * Afterwards run `npm run export:listings` and commit the regenerated data file.
 */
import 'dotenv/config'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const dryRun = process.argv.includes('--dry-run')

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) {
    console.error(`✖ Missing ${name} — copy .env.example to .env and fill it in.`)
    process.exit(1)
  }
  return v
}

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['description'],
  properties: {
    description: {
      type: 'string',
      description:
        'The rewritten listing description: 2-3 sentences, warm but plain, emphasising belonging, ' +
        'trust, and practical local context a host would actually offer. FORBIDDEN openers and ' +
        'fillers: "Nestled", "Located in", "Cozy", "Perfect for", "Whether you", "vibrant", "heart ' +
        'of", "home away from home", and any hype. Lead with something concrete and specific to the ' +
        'place; do not restate the title verbatim.',
    },
  },
} as const

const SYSTEM =
  'You write listing descriptions for Sojurno, an affinity-based stays marketplace. Voice: clear, ' +
  'warm, quietly premium — a trusted stay marketplace, NOT an adventure brand. Specific, practical, ' +
  'never hype. Match the voice of these real descriptions: "A calm, polished base for runners who ' +
  'want the city close and race morning made simple. The apartment keeps the practical things easy: ' +
  'breakfast space, quiet sleep, transit guidance, and a host who has done the weekend many times." ' +
  '/ "Built for hikers arriving with wet layers and changing plans. The stay is quiet and warm, ' +
  'with a host who can help turn a forecast into a sensible route."'

async function main() {
  const openai = new OpenAI({ apiKey: requireEnv('OPENAI_API_KEY') })
  const supabase = createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'))

  const { data, error } = await supabase
    .from('listings')
    .select('id,tenant_id,title,location,neighborhood,highlight,description,tags')
    .eq('source', 'generated')
    .order('created_at', { ascending: true })
  if (error) throw error
  const rows = data ?? []
  if (rows.length === 0) {
    console.log('No generated listings to reword.')
    return
  }

  // One small call per listing — robust (no batch truncation) and grounded in that row's context.
  let reworded = 0
  for (const r of rows) {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 1,
      messages: [
        { role: 'system', content: SYSTEM },
        {
          role: 'user',
          content:
            'Rewrite this listing description using its context. Keep the same place, property, and ' +
            'facts.\n\n' +
            JSON.stringify({
              title: r.title,
              place: `${r.neighborhood}, ${r.location}`,
              community: r.tenant_id,
              highlight: r.highlight,
              tags: r.tags,
              currentDescription: r.description,
            }),
        },
      ],
      response_format: { type: 'json_schema', json_schema: { name: 'description', schema: SCHEMA, strict: true } },
    })
    const { description } = JSON.parse(completion.choices[0]?.message?.content ?? '{}') as { description?: string }
    if (!description || description === r.description) continue
    console.log(`  ${r.title}\n  ${r.description}\n→ ${description}\n`)
    if (!dryRun) {
      const { error: upErr } = await supabase.from('listings').update({ description }).eq('id', r.id)
      if (upErr) throw upErr
    }
    reworded++
  }

  console.log(
    dryRun
      ? `[dry run] ${reworded}/${rows.length} description(s) previewed; nothing written.`
      : `✓ Reworded ${reworded}/${rows.length} description(s). Run \`npm run export:listings\` and commit.`,
  )
}

main().catch((err) => {
  console.error('\n✖ Reword failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
