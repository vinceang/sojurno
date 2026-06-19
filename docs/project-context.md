# Sojurno — Project Context

> A single-file synthesis of what Sojurno is, how it's built, and where it stands — written to be dropped into a Claude Project (or read cold by a new collaborator) as high-signal context. For the authoritative detail, follow the pointers: governance → [`AGENTS.md`](../AGENTS.md); the *why* → [`docs/decisions/`](decisions/); the *what/how* → [`docs/architecture.md`](architecture.md); the design system → [`docs/design-system.md`](design-system.md); current state → [`docs/progress.md`](progress.md).

## What Sojurno is

An **affinity-based, multi-tenant, peer-to-peer stays marketplace**: communities of shared interest where host and guest belong to the same group. One tenant-agnostic **engine**; many communities expressed as **config**. The thesis: *a community is **who**; the platform serves many communities from one codebase.* Ships with two contrasting live tenants — **Runners** and **Hikers** — plus coming-soon communities (Cyclists, Climbers, Skiers, Music Festivals).

It is also a **portfolio piece**: a public repo meant to demonstrate design-engineering range — design systems, tokens, Figma↔code parity, accessible UI, and clean multi-tenant architecture. The maker is **Vince Ang**, a design engineer working at the seam between design and code.

## Repo / deployment facts

- **Trunk repo:** `sojurno-v2` → GitHub **`vinceang/sojurno`** (public), deployed to **`sojurno.vercel.app`**.
- **Storybook** is hosted in the same Vercel deployment at **`/storybook`**.
- The original repo (`vinceang/sojurno-poc`) is archive/reference; `sojurno-redesign` is a Figma Make export kept as **visual reference only**.
- **Figma design-system file:** `A3mcfYDq5wZ7As46yri9jO` ("Sojurno Design System").
- Workflow: ADR-driven, phased, PR-per-change. Merges to `main` (which auto-deploys to the public site) are the owner's call.

## The prime directive — engine vs. tenant (ADR-0002)

Everything hinges on one separation:
- **Engine** (tenant-agnostic, shared): domain (listing/booking/reservation), component library, page scaffolds, routing, i18n machinery, primitive tokens. **Engine code never references a tenant by name or branches on tenant identity.**
- **Tenant** (config the engine reads): five axes — **brand** (semantic tokens), **vocabulary** (i18n + affinity language), **taxonomy** (filters/amenities), **trust signals**, **capabilities** (optional modules).

If a feature needs to know a tenant's *name*, it's in the wrong layer. Community differences are config + capability flags, never hardcoded conditionals. This is the expensive, hard-to-rebuild asset and the reason the original repo's architecture was kept while its visual layer was replaced.

## Tech stack

- **React 18 + TypeScript (strict) + Vite 5.**
- **Substrate:** Tailwind v4 + Radix primitives + `class-variance-authority` (shadcn-style), per ADR-0019. No CSS-in-JS.
- **Tokens (single source of truth):** DTCG JSON in `tokens/` → Style Dictionary v4 → generated `src/styles/_tokens.scss`, consumed by Tailwind's `@theme inline` bridge. Attribute-scoped: `:root`, `[data-theme="dark"]`, `[data-tenant="X"]`. Flipping an attribute re-resolves everything — a community accent is one token re-pointed, no component edits.
- **i18n:** EN / ES / FR. Chrome routes through `t()`; marketplace content (listing copy, reviews) is single-language (ADR-0016). Globe-icon locale switcher.
- **Imagery:** Unsplash is an owner-approved interim (ADR-0019); AI-generated static assets are the intended end state (ADR-0016) — no runtime AI, no scraping.
- **Quality bar:** ESLint, Storybook + a11y addon, GitHub Actions CI (`typecheck → lint → build → storybook a11y`). Scoped to the Vercel react-best-practices skill; backend-dependent rules dormant until ADR-0017.

## Design system (the headline craft artifact)

Three artifacts kept in sync: **code · Storybook · Figma**.

- **Layering:** tokens (CSS variables / Figma variables-with-modes) → components (cva variant APIs — *this is the semantic layer, expressed as component props, not CSS classes*) → utilities (Tailwind, kept inside components). Pages compose named components; raw utility clusters in page markup are treated as debt to extract.
- **Primitives** (`src/lib`): Button, Badge, Avatar, Card, Input, Separator, Eyebrow, SectionHeader, Rating, Stepper, Checkbox, Switch, Tabs, Select, Tooltip, Dialog, Calendar — each with documented cva variants + a Storybook story + a11y audit.
- **Variant naming is deliberate** because it becomes the Figma variant names: properties like `variant`, `size`, `tone`, `padding`, `elevation`, `kind`, `status`; semantic values (`primary/accent/secondary/ghost`, `sm/md/lg`) not literal ones.
- **Figma round-trip (Phase C):** variables (with Light/Dark + tenant modes) and components generated from code, then Code Connect `.figma.tsx` mappings so design and code stay mapped both ways. Every Figma variable carries WEB code syntax (`var(--color-accent)`) matching the generated CSS var names.

## Notable product decisions (ADRs)

- **0002** tenant = five-axis config · **0003–0005** gear as a capability module (on for hikers) · **0006** routing + traveler/host role · **0007** Storybook launchpad · **0014** brand axis (logo/color/type) · **0015** platform shell vs tenant app · **0016** content model (single-language marketplace content, offline AI imagery) · **0019** v2-as-trunk + shadcn/Tailwind substrate + token pipeline + portfolio bar · **0020** Collections — a capability that generalizes events (ADR-0009) into a discovery rail: tenant-scoped curated groupings (`kind: event | place`) shown as a poster rail atop Explore, linking to detail pages of associated listings.
- **Parked / not v1:** persistence & backend (0017 — Supabase + serverless, tenant RLS), iCal sync (0012). **Rejected:** open-marketplace external-listing ingestion/scraping (0013), AI intent search (0010).

## Current state (as of the latest session)

- App is feature-rich and live: platform landing (carousel community rows), Communities directory, Explore (filter bar with animated location field + grid/list views), listing detail (mosaic gallery + sticky booking with a date-range picker), host dashboard, About (maker profile), Collections rail + detail pages. Cards carry host avatar + proof badge.
- Design system: component spec written; `Eyebrow`/`SectionHeader` extracted and adopted; community cards merged to one `status` variant; Storybook hosted at `/storybook`.
- **Figma build (Phase C) in progress:** foundations done (51 variables across Primitives/Color/Radius/Community collections, 9 text styles, 3 shadow styles, a Foundations documentation page); components being built one per page — **Button + Badge, Avatar, Eyebrow, Separator, Input done; next: Card, Rating, Stepper, SectionHeader, then the Radix-backed primitives**, then Code Connect.

## How to work in this project

Read `AGENTS.md` first (binding). Honor the engine/tenant line. Keep tokens the only source of color/radius/spacing. Every chrome string through `t()` (EN/ES/FR). Propose an ADR for new decisions rather than burying them in code. Work in phases with hard stops; commit at boundaries referencing the ADR; keep `docs/progress.md` current. Hold merges to `main` for the owner (production deploy).
