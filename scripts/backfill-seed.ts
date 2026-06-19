/**
 * One-time backfill (ADR-0022): inserts the 12 hand-authored seed listings into Supabase
 * (`source='seed'`) so the database is the single source of truth for ALL listings, not just
 * generated ones. Idempotent (upsert by id); safe to re-run. Their images stay as the existing
 * Unsplash URLs — these listings predate the gpt-image-1 pipeline.
 *
 *   npx tsx scripts/backfill-seed.ts
 *
 * After this, `npm run export:listings` pulls all published rows into src/data/listings.generated.ts.
 */
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { SEED_LISTINGS } from '../src/data/listings'

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) {
    console.error(`✖ Missing ${name} — copy .env.example to .env and fill it in.`)
    process.exit(1)
  }
  return v
}

async function main() {
  const supabase = createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'))

  // Stamp seed rows with early, ordered timestamps so they sort ahead of generated rows in the
  // export (preserving the curated order at the front of each community row).
  const base = Date.UTC(2026, 0, 1)
  const rows = SEED_LISTINGS.map((l, i) => ({
    id: l.id,
    tenant_id: l.tenant,
    booking_mode: l.bookingMode,
    external_url: l.externalUrl ?? null,
    title: l.title,
    location: l.location,
    neighborhood: l.neighborhood,
    price: l.price,
    rating: l.rating,
    review_count: l.reviewCount,
    host: l.host,
    images: l.images,
    tags: l.tags,
    amenities: l.amenities,
    highlight: l.highlight,
    description: l.description,
    gear: l.gear ?? null,
    status: 'published' as const,
    source: 'seed' as const,
    created_at: new Date(base + i * 1000).toISOString(),
  }))

  const { error } = await supabase.from('listings').upsert(rows)
  if (error) throw error
  console.log(`✓ Backfilled ${rows.length} seed listing(s) into Supabase (source='seed').`)
  console.log('  Run `npm run export:listings` to pull all published rows into the app.')
}

main().catch((err) => {
  console.error('\n✖ Backfill failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
