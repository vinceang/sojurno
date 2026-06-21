# Sojurno — Project Context

> A single-file synthesis of what Sojurno is, how it's built, and where it stands — written to be dropped into a Claude Project (or read cold by a new collaborator) as high-signal context. For the authoritative detail, follow the pointers: governance → [`AGENTS.md`](../AGENTS.md); the *why* → [`docs/decisions/`](decisions/); the *what/how* → [`docs/architecture.md`](architecture.md); the design system → [`docs/design-system.md`](design-system.md); current state → [`docs/progress.md`](progress.md).

## What Sojurno is

An **affinity-based, multi-tenant, peer-to-peer stays marketplace**: communities of shared interest where host and guest belong to the same group. One tenant-agnostic **engine**; many communities expressed as **config**. The thesis: *a community is **who**; the platform serves many communities from one codebase.* Ships with **three live tenants — Runners, Hikers, and Climbers** — plus coming-soon communities (Cyclists, Skiers, Music Festivals).

It is also a **portfolio piece**: a public repo meant to demonstrate design-engineering range — design systems, tokens, Figma↔code parity, accessible UI, clean multi-tenant architecture, and (now) a real backend + AI content pipeline. The maker is **Vince Ang**, a design engineer working at the seam between design and code.

## Repo / deployment facts

- **Trunk repo:** `sojurno-v2` → GitHub **`vinceang/sojurno`** (public), deployed on Vercel at **`sojurno.com`** (custom domain).
- **Storybook** is hosted in the same Vercel deployment at **`sojurno.com/storybook/`**.
- The original repo (`vinceang/sojurno-poc`) is archive/reference; `sojurno-redesign` is a Figma Make export kept as **visual reference only**.
- **Figma design-system file:** `A3mcfYDq5wZ7As46yri9jO` ("Sojurno Design System").
- **Package manager: npm.** Workflow: ADR-driven, phased, **PR-per-change**, green-bar gate. Merges to `main` (which auto-deploys to the public site) are the owner's call.

## The prime directive — engine vs. tenant (ADR-0002)

Everything hinges on one separation:
- **Engine** (tenant-agnostic, shared): domain (listing/booking/reservation), component library, page scaffolds, routing, i18n machinery, primitive tokens. **Engine code never references a tenant by name or branches on tenant identity.**
- **Tenant** (config the engine reads): five axes — **brand** (semantic tokens), **vocabulary** (i18n + affinity language), **taxonomy** (filters/amenities), **trust signals**, **capabilities** (optional modules).

If a feature needs to know a tenant's *name*, it's in the wrong layer. Community differences are config + capability flags, never hardcoded conditionals. This is the expensive, hard-to-rebuild asset and the reason the original repo's architecture was kept while its visual layer was replaced. **Proof point:** activating Climbers (June 2026) was config + data only — widen the active-tenant union, flip `active: true` + capabilities + stats, add gear/reviews/a landing row + i18n keys + a generator brief. No engine branching.

## Tech stack

- **React 18 + TypeScript (strict) + Vite 5**, React Router (deep-linkable `/t/:tenant/...`).
- **Substrate:** Tailwind v4 + Radix primitives + `class-variance-authority` (shadcn-style), per ADR-0019. No CSS-in-JS.
- **Tokens (single source of truth):** DTCG JSON in `tokens/` → Style Dictionary → generated `src/styles/_tokens.scss`, consumed by Tailwind's `@theme inline` bridge. Attribute-scoped: `:root`, `[data-theme="dark"]`, `[data-tenant="X"]`, `[data-community="X"]`. Flipping an attribute re-resolves everything — a community accent is one token re-pointed, no component edits. **Hex lives only in `tokens/primitives.json`; components never carry raw hex.**
- **Backend (built — ADR-0022 + ADR-0026):** Supabase Postgres + Storage. An **offline OpenAI generator** seeds listings (structured-output copy + `gpt-image-1` imagery → Storage). **The runtime backend is now live (ADR-0026):** the browser authenticates (real Supabase Auth) and **writes** — full add/edit/delete listings with image upload, plus per-account saved listings — all behind **owner-scoped RLS**. Reads are **hybrid**: the curated seed/generated set ships as a committed **build-time export** (`src/data/listings.generated.ts`, read synchronously — fast, resilient if the free-tier DB sleeps), with **live `source='user'` rows fetched at runtime and merged** via `useListings`. **No AI at runtime, ever** (the generator stays offline). Auth identity is a single shared **demo account** (`test@sojurno.com`, creds posted on the login screen); RLS keeps the curated rows read-only and the 29 protected. A **cron-driven generator** on the same table is a future option.
- **i18n:** EN / ES / FR. Chrome routes through `t()` (flat `Record<MessageKey,string>`, 3-locale parity enforced); marketplace content (listing copy, reviews) is single-language (ADR-0016). Long-form content (legal pages) lives in per-locale **data modules** with EN fallback, kept out of the message catalog. Globe-icon locale switcher.
- **Theme:** light/dark shipped (`data-theme` flip + `localStorage`); the dark token layer is complete.
- **Imagery:** generated listings carry **AI images** (`gpt-image-1` → Supabase Storage). The **seed 12** listings + all host **avatars** stay on **Unsplash** (owner-approved interim, ADR-0016/0019) — no scraping, no runtime AI.
- **Quality bar:** ESLint, Storybook + a11y addon, GitHub Actions CI (`typecheck → lint → build → storybook a11y`). Runtime Supabase reads/writes are now active (ADR-0026), so data-fetching lives behind a context seam (`UserListingsProvider`/`SavedListingsProvider`) with graceful fallback when the DB is unconfigured/asleep.

## Design system (the headline craft artifact)

Three artifacts kept in sync: **code · Storybook · Figma**.

- **Layering:** tokens (CSS variables / Figma variables-with-modes) → components (cva variant APIs — *this is the semantic layer, expressed as component props, not CSS classes*) → utilities (Tailwind, kept inside components). Pages compose named components; raw utility clusters in page markup are treated as debt to extract.
- **Primitives** (`src/lib`, 15): Button, Badge, Avatar, Card, Input, Separator, Eyebrow, SectionHeader, Rating, Stepper, Checkbox, Switch, Tabs, Select, Tooltip, Dialog (+ a vendored Calendar) — each with documented cva variants + a Storybook story + a11y audit. Composite components (`src/components`) have stories too.
- **Variant naming is deliberate** because it becomes the Figma variant names: properties like `variant`, `size`, `tone`, `padding`, `elevation`, `kind`, `status`; semantic values (`primary/accent/secondary/ghost`, `sm/md/lg`) not literal ones.
- **Long-form reading layout (`.sj-prose`):** the one surface that exercises the Instrument Serif → Plus Jakarta hierarchy end to end (legal pages today; future articles). Tokens only.
- **Figma round-trip (Phase C) — authored:** Foundations (51 variables across Primitives/Color/Radius/Community collections with Light/Dark + tenant modes, 9 text + 3 shadow styles, a specimen page) + 15 token-bound component pages; **16 `src/lib/*.figma.tsx` Code Connect mappings** validated by `figma connect parse`. **Publishing to Dev Mode is plan-gated** (Code Connect needs Org/Enterprise; account is Pro) — mappings go live with `npm run figma:publish` once upgraded, no rework.

## Notable product decisions (ADRs)

- **0002** tenant = five-axis config · **0003–0005** gear as a capability module (on for Hikers + Climbers) · **0006/0021** routing + traveler/host role: **ADR-0021 built** a session-gated mock host onboarding (persisted `localStorage` identity, "Become a host" form → demo-mode dialog → authenticated host session; session-aware account menu) · **0007** Storybook launchpad · **0014** brand axis (logo/color/type) · **0015** platform shell vs tenant app · **0016** content model (single-language marketplace content, offline AI imagery) · **0019** v2-as-trunk + shadcn/Tailwind substrate + token pipeline + portfolio bar · **0020** Collections — a capability generalizing events into a discovery rail (`kind: event | place`) atop Explore.
- **Built backend / AI:** **0017** persistence & backend, **promoted and built by 0022** — Supabase + offline OpenAI generator (copy + `gpt-image-1`) + build-time export. Triggered by 6-up landing rows needing >6 listings/tenant.
- **Convention (built):** **0023** *no dead-end CTAs* — every major CTA resolves via one of three tiers (demo dialog / real page / inline stub), generalizing ADR-0021's demo-mode pattern. Shipped the footer's Privacy/Terms/Accessibility as **real long-form content pages** + demo dialogs for Reserve / Accept-Decline / Create-a-community / Forgot-password / the Explore date stub.
- **Auth + toasts (built):** **0024** mock→real login (a real Supabase Auth sign-in behind the same UX; single shared Test User identity) · **0025** transient **toast** pattern (Radix), Save **gated behind login** with an in-context login modal, and the **Saved view**.
- **Runtime backend (built):** **0026** activates the parked runtime path — real auth, live owner-scoped **writes** (full add/edit/delete listings + image upload), **per-account saved listings**, and **hybrid reads** (curated export + live `source='user'` overlay). Single shared demo account; the curated 29 stay read-only.
- **Parked / not v1:** real multi-user registration & admin surface, iCal sync (0012). **Future option:** cron-driven listing generation on the same table. **Proposed:** linked listings / external booking (0018). **Rejected:** open-marketplace external-listing ingestion/scraping (0013), AI intent search (0010), host-run events (0009, superseded by Collections).

## Current state (as of June 2026)

- **Live & feature-rich:** platform landing (atmospheric **tri-tone aura + grain hero**, carousel community rows for all 3 communities), Communities directory, Explore (filter bar + grid/list views, Collections rail), listing detail (mosaic gallery + Share/Save + sticky booking with date-range picker; gear section for gear-capable tenants), host dashboard, About (maker profile), Collections detail, **real login** + host onboarding, **legal content pages** (`/legal/:docId`), a **Saved view**, and the **host add/edit/delete listing facility** with image upload. Dark mode + animated toasts throughout. Cards carry host avatar, proof badge, and a save heart.
- **Content:** **3 communities** (Runners / Hikers / Climbers). The curated ~29 listings ship as the committed **build-time export**; host-created listings are written **live to Supabase** and merged in at runtime. Generated listings carry AI imagery; seed + avatars on Unsplash.
- **Backend live (ADR-0026):** real Supabase Auth (shared demo account `test@sojurno.com`/`demo123`), owner-scoped RLS, Storage image uploads, per-account saved listings — all verified end-to-end against the live project.
- **Design system:** 15 documented primitives (incl. Toast) + composite stories, hosted Storybook; Figma Foundations + 15 components + 16 Code Connect mappings authored (publish plan-gated).
- **Open seams / next:** real Explore date/listing filtering (currently a coming-soon stub); backfilling seed images to AI (deferred — risks image↔copy drift); cron-driven listing generation; publishing Code Connect on plan upgrade; roll the `.sj-link` underline convention across remaining inline links.

## How to work in this project

Read `AGENTS.md` first (binding). Honor the engine/tenant line. Keep tokens the only source of color/radius/spacing (no raw hex). Every chrome string through `t()` (EN/ES/FR); long-form content in per-locale data modules. Propose an ADR for new decisions rather than burying them in code. Work in phases with hard stops; commit at boundaries referencing the ADR; keep `docs/progress.md` current. Get explicit authorization before destructive DB/Storage operations. Hold merges to `main` for the owner (production deploy).
