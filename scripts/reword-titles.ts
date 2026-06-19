/**
 * One-time cleanup (ADR-0022 follow-up): rewrites the titles of existing GENERATED listings that
 * came out as AI slop ("Cozy Retreat…", "Comfortable Haven…") before the generator prompt was
 * tightened. Sends each listing's real context (place, neighborhood, description, highlight) to
 * OpenAI in ONE batch call and updates only the `title` column. Text-only (cents); non-destructive
 * — images, copy, and seed listings are untouched.
 *
 *   npx tsx scripts/reword-titles.ts            # apply
 *   npx tsx scripts/reword-titles.ts --dry-run  # preview new titles, write nothing
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
  required: ['title'],
  properties: {
    title: {
      type: 'string',
      description:
        'The rewritten listing title. MUST begin with a noun — a place name or the property type ' +
        '(e.g. "Back Bay brownstone two blocks from the marathon buses", "North Fork cabin gateway ' +
        'to Glacier NP trails"). It is FORBIDDEN to begin with any adjective (cozy, comfortable, ' +
        'charming, warm, rustic, serene, lovely, stunning, perfect, peaceful, inviting, quaint, ' +
        'historic). ~6-12 words. No "Retreat"/"Haven"/"Getaway"/"Sanctuary"/"Oasis" filler, no hype.',
    },
  },
} as const

const SYSTEM =
  'You write titles for Sojurno, an affinity-based stays marketplace. Voice: clear, warm, quietly ' +
  'premium — a trusted stay marketplace, NOT an adventure brand. Specificity over adjectives. ' +
  'Match the voice of these real titles: "Back Bay brownstone two blocks from the marathon buses", ' +
  '"Lakefront studio built around race-week calm", "Portal cabin with bear canister and trail beta".'

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
            'Rewrite this listing title using its context. Keep the same place and property.\n\n' +
            JSON.stringify({
              place: `${r.neighborhood}, ${r.location}`,
              community: r.tenant_id,
              highlight: r.highlight,
              description: r.description,
              tags: r.tags,
              currentTitle: r.title,
            }),
        },
      ],
      response_format: { type: 'json_schema', json_schema: { name: 'title', schema: SCHEMA, strict: true } },
    })
    const { title } = JSON.parse(completion.choices[0]?.message?.content ?? '{}') as { title?: string }
    if (!title || title === r.title) continue
    console.log(`  ${r.title}\n→ ${title}\n`)
    if (!dryRun) {
      const { error: upErr } = await supabase.from('listings').update({ title }).eq('id', r.id)
      if (upErr) throw upErr
    }
    reworded++
  }

  console.log(
    dryRun
      ? `[dry run] ${reworded}/${rows.length} title(s) previewed; nothing written.`
      : `✓ Reworded ${reworded}/${rows.length} title(s). Run \`npm run export:listings\` and commit.`,
  )
}

main().catch((err) => {
  console.error('\n✖ Reword failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
