# Sojurno — Claude Code Project Briefing

## What this is

Sojurno is an affinity-based peer-to-peer stays platform. The core thesis: guests and hosts belong to the same shared-interest community. Think Airbnb for runners, hikers, climbers — "stay with people who get why you're traveling."

The platform is **multi-tenant**: one tenant-agnostic **engine** supports many communities through **config**. Each community varies by color accent, vocabulary, taxonomy, trust signals, and enabled capabilities, while sharing the same layout, component system, routing, and interaction patterns.

This repo (`sojurno-v2`) is the **production trunk** → GitHub `vinceang/sojurno`, deployed on Vercel at **sojurno.com** (Storybook at **sojurno.com/storybook/**). It is a fresh, fully-componentized React app — **not** a single-file prototype.

---

## Source of truth — read these first

This file is orientation only. The living, authoritative docs (when they disagree with this file or with code, **they win**):

1. **`AGENTS.md`** — binding governance for AI agents. Read in full before any task.
2. **`docs/architecture.md`** — the *what/how* (engine/tenant line, five-axis tenant config).
3. **`docs/decisions/*.md`** — the *why*. Each is an ADR; check its status before acting (Accepted = in scope; Proposed/Rejected = do not build).
4. **`docs/progress.md`** — the *where-are-we*: current phase, status, open seams. Check at the start of every session.

---

## Tech stack

- **React 18** + **TypeScript**, **Vite**, **React Router** (real URL routing — `/t/:tenant/...`)
- **Tailwind CSS v4** on a **shadcn / Radix UI** substrate; component variants via **cva**; `cn()` in `src/lib/utils.ts`
- **Design tokens generated** via a DTCG → Style Dictionary pipeline: `tokens/*.json` → `tokens/build-tokens.mjs` → git-ignored `src/styles/_tokens.scss`, bridged into Tailwind via `@theme inline`. Run with `npm run tokens` (auto-run by `pre*` hooks).
- **i18n** EN/ES/FR (`src/i18n/`) — all chrome is translated; every locale must stay complete.
- **Lucide React** (icons); **Instrument Serif** (display) + **Plus Jakarta Sans** (body/UI)
- **Storybook** (every primitive has a story + a11y audit); hosted at `/storybook`
- **Supabase** (Postgres + Storage) + an **offline OpenAI generator** for listings/images (ADR-0022) — see below
- **Package manager: npm** (`npm install`, `package-lock.json`)

```bash
npm install
npm run dev          # vite dev server (runs tokens first)
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run build        # tsc -b && vite build
npm run storybook    # local Storybook
```

---

## File structure

```
src/
  App.tsx            ← route table only (React Router)
  main.tsx           ← providers: Router → Theme → I18n → Session
  pages/             ← one file per route (LandingPage, ExplorePage, ListingPage, …)
  components/        ← composites (Header, Footer, ListingCard, CommunityListingRow, …) + *.stories.tsx
  lib/               ← 15 themed primitives (Button, Badge, Card, Dialog, …) + cva variants + *.figma.tsx Code Connect
  data/              ← listings.ts (seam) + listings.generated.ts (DB export, committed) + collections.ts, gear.ts
  tenants/           ← five-axis tenant config + TenantProvider/useTenant (engine/tenant anchor)
  session/           ← persisted mock host session (SessionProvider/useSession) — ADR-0021
  theme/             ← light/dark ThemeProvider/useTheme (data-theme)
  i18n/              ← messages.ts (EN/ES/FR) + I18nProvider/useI18n
  styles/            ← _tokens.scss (generated), index.scss, tailwind.css
tokens/              ← DTCG token source + build-tokens.mjs
scripts/             ← generate-listings.ts, export-listings.ts (offline, tsx; not in the app graph)
supabase/            ← SQL migrations
docs/                ← architecture.md, progress.md, decisions/*.md
```

---

## Routing (React Router — see `src/App.tsx`)

Public shell: `/` (landing), `/communities`, `/start`, `/about`, `/design`, `/become-a-host`, `/login`.
Tenant-scoped under `/t/:tenantId` (wrapped by `TenantProvider`): `explore`, `collections/:id`, `stays/:listingId`, `host`, `host/listings`.

Active communities: **runners, hikers, climbers** (`ActiveTenantId`). `DEFAULT_TENANT = 'runners'`.

---

## Conventions that matter

- **Engine vs. tenant (prime directive, ADR-0002):** the engine never knows a community's *name*. If a feature branches on the tenant name, it's in the wrong half. Communities differ only by config in `src/tenants/`.
- **No raw hex in components (ADR-0019).** Color lives only in `tokens/primitives.json` → tokens. Reference `var(--color-*)` (e.g. `--color-ember`/`--color-pine`/`--color-violet`) and `color-mix()` in SCSS, never hardcoded values. Per-element community tint via `[data-community]`.
- **Primitives are cva + token-backed Tailwind**, documented in Storybook with an a11y audit. Compose with `asChild` where supported.
- **Data is DB-sourced.** `src/data/listings.ts` is the seam; the app reads `listings.generated.ts` (committed, produced by `npm run export:listings` from Supabase) **synchronously** — no runtime DB dependency. Don't hand-edit listing data; generate/export it.
- **Listings & generator (ADR-0022):** new listings come from the offline OpenAI generator (`scripts/generate-listings.ts`, structured-output copy + `gpt-image-1` images → Supabase Storage). Secrets live in `.env` (git-ignored), used by scripts only — never imported by client code. The seed 12 still use Unsplash (owner-approved interim, ADR-0016).
- **i18n:** any user-facing string goes through `t()` and must be added to all three locales in `src/i18n/messages.ts`.
- **The green bar (a phase/PR isn't done until all pass):** `npm run typecheck` · `npm run lint` · `npm run build` · Storybook a11y for any changed component.
- **Workflow:** branch per change, open a PR, keep the engine/tenant line intact, reference the relevant ADR. The user merges.

---

## Brand voice

- Clear, warm, quietly premium.
- Less "adventure brand," more "trusted stay marketplace for people who share your context."
- Copy emphasises belonging, trust, shared rituals, practical local knowledge.
- Never "lorem ipsum," and never AI-slop filler ("Cozy/Charming/Nestled in the heart of…"). Use real cities, real race names, real trail names.

DISTILLED_AESTHETICS_PROMPT = """
<frontend_aesthetics>
You tend to converge toward generic, "on distribution" outputs. In frontend design, this creates what users call the "AI slop" aesthetic. Avoid this: make creative, distinctive frontends that surprise and delight. Focus on:

Typography: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics.

Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Draw from IDE themes and cultural aesthetics for inspiration.

Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions.

Backgrounds: Create atmosphere and depth rather than defaulting to solid colors. Layer CSS gradients, use geometric patterns, or add contextual effects that match the overall aesthetic.

Avoid generic AI-generated aesthetics:
- Overused font families (Inter, Roboto, Arial, system fonts)
- Clichéd color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character

Interpret creatively and make unexpected choices that feel genuinely designed for the context. Vary between light and dark themes, different fonts, different aesthetics. You still tend to converge on common choices (Space Grotesk, for example) across generations. Avoid this: it is critical that you think outside the box!
</frontend_aesthetics>
"""
