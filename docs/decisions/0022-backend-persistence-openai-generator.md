# ADR-0022 — Backend persistence + OpenAI listing generator (promotes ADR-0017)

**Status:** Accepted · Implemented · **Date:** 2026-06-19

> Promotes [ADR-0017](0017-persistence-and-backend-direction.md) from *parked* to *built*, and
> records the concrete choices the parked ADR deferred. ADR-0017 said: "Promote this ADR to
> Accepted when the first real trigger (persistence, auth, or admin) arrives; until then, do not
> build." The trigger has arrived — see Context. This ADR keeps ADR-0017's spine (managed Postgres
> via Supabase, multi-tenant data with RLS, a generator-as-offline-preloader, no AI at runtime) and
> refines three things it left open: the **read strategy**, the **generation provider**, and
> **imagery**.

## Context

The landing-card work (ADR-0019 Phase D polish — 6-up rows + a fluid compact card, merged in
PR #23) made a latent problem load-bearing: there are only **6 listings per tenant**, so the
desktop community row is exactly full with nothing to scroll past. The product now visibly wants
*more listings*, and hand-editing the `LISTINGS` array in `src/data/listings.ts` does not scale —
it is slow, and it couples content volume to source commits.

That is precisely the trigger ADR-0017 was waiting for: a real need to **produce and persist
listings at volume**. It needs (a) a home for the data and (b) a generator. Building it now is also
deliberate portfolio scope (ADR-0019's engineering bar) — a real OpenAI integration and a real
Supabase backend are demonstrable skills worth having in the repo.

## Decision

Everything AI runs **offline** in a script the maintainer invokes; the running app never calls AI
and (today) never calls the database — consistent with ADR-0010 and ADR-0017.

### 1. Provider = OpenAI, for both copy and imagery
The generator (`scripts/generate-listings.ts`) uses **OpenAI** for *both* listing copy/metadata
(Chat Completions **structured outputs** against a JSON schema mirroring the `Listing` type) and
the listing **image** (`gpt-image-1`). The official `openai` SDK is used directly (the clearest,
most demonstrable integration). This supersedes the earlier session idea of authoring copy with
Anthropic/agent-in-the-loop; a single coherent OpenAI pipeline was chosen intentionally for the
hands-on experience. (Higgsfield AI's MCP — a subscription-credits image path — was evaluated and
**reserved for a different project**, not this one.)

### 2. Imagery = AI-generated, hosted in Supabase Storage
Generated listings get real AI images hosted in a public **Supabase Storage** bucket
(`listing-images`), replacing the **Unsplash interim** (the owner-approved deviation recorded in
ADR-0019) **for generated listings**. This closes the ADR-0016 imagery seam for this content. The
hand-authored seed listings keep their Unsplash images as a committed dev fixture.

### 3. Read strategy = build-time export, not runtime fetch
ADR-0017's letter said "Vercel serverless functions behind a thin API." The app is a static Vite
SPA whose data accessors (`getListingsByTenant`, `getListing`, `getGallery`, `getReviews`) are
**synchronous and called inline during render** across six pages. Rather than force an async
refactor + loading states + a runtime DB dependency (the free tier pauses when idle), the generator
writes to Supabase (the source of truth) and a second script (`scripts/export-listings.ts`) pulls
`status='published'` rows into a **committed** `src/data/listings.generated.ts` that the app reads
synchronously at build time. `src/data/listings.ts` becomes the seam: `LISTINGS = seed +
generated`, accessor signatures unchanged, **zero page changes**. Vercel deploys stay hermetic (no
DB access at build). Flipping to runtime `supabase-js` + RLS reads later remains the one-file change
ADR-0017 always intended — the RLS policies (public select of published rows only) are written now
in anticipation.

### 4. Scope = data + generator + storage + export only
This phase stands up the schema (`tenants`, `listings`), the generator, Storage, and the export.
**Auth/admin is deferred** (ADR-0017's "admin role first" is not built) — auth was not the trigger,
and Supabase Studio covers manual edits day one. Reviews stay as the per-tenant static `REVIEWS`
(unchanged); a `reviews` table is a later option.

### Schema (built)
`tenants (id, slug, name, active)` mirrors `src/tenants/tenants.ts`. `listings` mirrors the
`Listing` type (camelCase → snake_case; `host`/`images`/`gear` as `jsonb`; `tags`/`amenities` as
`text[]`) plus `status (draft|published)` and `source (seed|generated)`. RLS: public `select` of
published listings + readable tenants; all writes denied to anon (the generator uses the
service-role key, which bypasses RLS). See `supabase/migrations/`.

## Why

- **The trigger is genuine, the build is bounded.** Volume is the need; this delivers a generator
  and a home for its output without dragging in auth or a runtime API the SPA doesn't need yet.
- **Build-time export fits a static SPA.** It keeps the app fast, free, and offline-capable, avoids
  a six-page async refactor, and sidesteps free-tier pausing — while preserving the future
  runtime-fetch option as a one-file change. The DB is still the real source of truth.
- **One OpenAI pipeline is a clean, demonstrable artifact** (structured outputs + image gen +
  Storage upload + bulk insert) and keeps the public app AI-free (offline preloader).
- **Committing the generated data** decouples deploys from the database and from secrets entirely —
  the image URLs are public, nothing secret is committed.

## Alternatives considered

- *Runtime `supabase-js` + RLS reads (or Vercel functions) now* — the literal ADR-0017 path.
  Deferred: it forces async/loading refactors across six pages and a live runtime dependency for no
  present benefit; the seam keeps it a cheap future flip.
- *Keep Unsplash, defer images* — viable and free, but the maintainer chose the OpenAI image path
  deliberately for the integration experience; image count/quality are knobs that bound the cost.
- *Higgsfield MCP for images* (subscription credits, agent-callable) — a good fit, but reserved for
  a separate project to avoid muddying the two.
- *Templated/combinatorial generator (no AI)* — cheaper and reproducible, but less distinctive prose
  and not the skill the maintainer wanted to exercise.
- *Anthropic / agent-authored copy* — the earlier session idea; superseded by the single-provider
  OpenAI pipeline.

## Consequences

- New `scripts/generate-listings.ts` (OpenAI) and `scripts/export-listings.ts`; `npm run
  gen:listings` / `npm run export:listings`. Secrets (`OPENAI_API_KEY`, `SUPABASE_URL`,
  `SUPABASE_SERVICE_ROLE_KEY`) live in a git-ignored `.env` used by scripts only — never imported by
  client code. `.env.example` documents them.
- `src/data/listings.generated.ts` is **committed** and regenerated by the export; do not edit it by
  hand. The seed 12 remain the committed fixture and the linked-listing (external) demo examples.
- A real **OpenAI cost** exists, isolated to image generation (~$0.04–$0.19/image, `gpt-image-1`),
  bounded by images-per-listing and quality; the generator prints an estimate and supports
  `--dry-run`. Supabase free tier and existing Vercel hosting are $0.
- ADR-0016's "no stock/scraped imagery; AI-generated, made offline" is now realized for generated
  listings. ADR-0017's persistence direction is now **built** (read path refined as above; auth
  still parked).
- **Open seams:** runtime reads + RLS-enforced per-request tenant scoping; auth/admin; a `reviews`
  table; multi-image galleries (today the generator defaults to one hero image).
