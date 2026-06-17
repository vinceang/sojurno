# ADR-0019 — v2 redesign as trunk: visual language, shadcn/Tailwind substrate, Figma round-trip goal

**Status:** Accepted · Implemented (foundation) · **Date:** 2026-06-17

> Supersedes the **visual layer** of ADR-0014 (token *values*, type pairing, brand model) and revisits the **component-substrate** assumption behind ADR-0007 — without touching the engine/tenant architecture (ADR-0002), which is exactly why it survives the move. Origin: a separately-built Figma Make redesign (`sojurno-redesign`) whose visual language and information architecture were judged materially stronger than the original build. The full trunk-choice analysis is in [`docs/redesign-decision.md`](../redesign-decision.md).

## Context

Two earlier codebases existed: the original `sojurno` (correct multi-tenant architecture — engine/tenant separation, DTCG token pipeline, i18n, routing, ADR governance — on a weaker visual skin) and `sojurno-redesign` (a single-file Figma Make export with a stronger "quietly premium" look but the inverse of our invariants: it branches the engine on community name, hardcodes accent colors inline, has no capability model, no i18n, no routing, hotlinks stock imagery).

The expensive, hard-to-reproduce asset was the **architecture**; the redesign's value (visual language + IA concepts) was **portable**. The original plan (Path A) was to bring the design *into* the original repo. In practice the owner executed Path A as a **fresh production repo — `sojurno-v2`** — rebuilt on the redesign's look-and-feel while re-implementing the original's architecture from its ADRs. This ADR records that `sojurno-v2` is now the **trunk**; the original `sojurno` becomes a read-only reference/archive and `sojurno-redesign` remains a visual reference only.

Two intents shaped scope: (1) **the design system is the priority** — widgetized base components with documented variants that round-trip to/from Figma; (2) **the repo is portfolio-facing** — engineering practice must be verifiable, not asserted.

## Decision

### 1. `sojurno-v2` is the trunk
A fresh React 18 + Vite + TypeScript (strict) build that keeps Sojurno's affinity / multi-tenant product thesis and ADR governance, rebuilt on the redesign's visual language. Original `sojurno` = archive/reference; `sojurno-redesign` = visual reference. The engine/tenant line (ADR-0002) is preserved by construction — components and pages resolve tenants from typed config (`src/tenants/`); **no component branches on community name** (verified).

### 2. Redesign visual language adopted, in detail
- **Type:** display/headings/wordmark → **Instrument Serif** (italic wordmark); body/UI → **Plus Jakarta Sans**. Replaces Fraunces + Albert Sans.
- **Neutral base + community-accent model.** Base brand is a calm neutral (off-white `#FAFAF8` / near-black `#1A1916`); the **community color is the accent** (runners `#E8651A`, hikers `#2D6A4F`), not the global brand — inverting the prior teal-brand + gold-accent model.
- **Radius/spacing** align to the redesign; the bespoke **"arch" radius is retired**.

### 3. shadcn/Radix + Tailwind v4 substrate, fed by our tokens
Radix primitives + `class-variance-authority` variants on **Tailwind v4**, replacing the hand-rolled pure-CSS lib. We do **not** adopt shadcn's default hardcoded theme. Tailwind v4 `@theme inline` (`src/styles/tailwind.css`) maps utilities (`bg-background`, `text-accent`, `rounded-lg`…) to our CSS variables, so every utility resolves to `var(--color-*)` and the cascade still re-points per tenant/theme. A community accent is **one token re-pointed**, no component edits — engine/tenant separation intact.

### 4. Token authoring: interim SCSS now, DTCG pipeline to be reinstated
v2 currently authors tokens **by hand in `src/styles/_tokens.scss`**, attribute-scoped exactly as before (`:root`, `[data-theme="dark"]`, `[data-tenant="X"]`). This is a deliberate **interim**: it preserves the runtime cascade but drops the DTCG-JSON → Style Dictionary tooling and tenant auto-discovery the original had.

Because **Figma Code Connect and design-token round-trip remain goals** (see §5), the **DTCG → Style Dictionary pipeline will be reinstated** as the first foundation task — Style Dictionary can emit Figma-compatible variables and re-anchors `_tokens.scss` as *generated output*, not the source. Until then, `_tokens.scss` is the source and is hand-maintained.

### 5. Figma Code Connect — bidirectional design↔code parity (goal, pending)
Each code component gets a `.figma.tsx` Code Connect mapping; a matching Figma library is built/synced from the components, fed by the reinstated token variables. Not yet implemented.

### 6. i18n preserved and extended (ADR-0016 contract intact)
Chrome stays multilingual; marketplace content single-language. v2 ships **EN / ES / FR** (French added vs the original's EN/ES). The locale switcher is a **globe-icon Radix `DropdownMenu`** calling `setLocale` (`src/components/LanguageSwitcher.tsx`) — already built.

### 7. Portfolio-grade engineering bar
Vercel **react-best-practices** as the standard, scoped honestly to a Vite SPA (re-render / rendering / bundle / JS / advanced active; waterfalls / server-side / data-fetching dormant until the backend, ADR-0017). **ESLint** (`eslint-plugin-react-hooks`, `react-refresh`, `typescript-eslint`) and **Storybook + a11y addon** are wired; `typecheck` and `lint` are clean. **GitHub Actions CI** (`typecheck → lint → build → storybook a11y`) is still to be added.

## Why
- **Keeps the irreplaceable asset.** The architecture is the expensive thing; the design is portable. v2 carried the engine/tenant line across cleanly while gaining the better skin.
- **The `@theme inline` bridge dissolves the only objection to Tailwind/shadcn** (token-pipeline purity): shadcn's variant ergonomics + Figma tooling *and* tokens stay the source of color/radius.
- **Serves the stated priority.** cva variants + Storybook + (planned) Code Connect is the most direct path to a widgetized, Figma-round-tripping system.
- **Reaffirms ADR-0014's governance while replacing its values.** "Bounded token slots, no per-component free-form styling" stands; only the palette, type pairing, brand model, and substrate change.

## Alternatives considered
- *Grow the redesign repo as trunk (Path B)* — rejected: would mean rebuilding the multi-tenant architecture against hostile conventions. (Analysis: `redesign-decision.md`.)
- *Keep the bespoke pure-CSS lib* — rejected per the owner's call: shadcn/cva + Code Connect better serve the design-system-and-Figma priority; token purity is preserved by the bridge.
- *Adopt shadcn's default theme* — rejected: would dethrone the tokens and break tenant/theme composition.
- *Keep SCSS tokens permanently and drop the DTCG pipeline* — **deferred, not rejected.** Acceptable as an interim, but the Figma variable round-trip wants Style Dictionary, so reinstatement is scheduled rather than abandoned.
- *Apply all 70 best-practice rules literally* — rejected: many are Next.js/RSC-specific; scoping them to the SPA is the better practice.

## Consequences
- **`sojurno-v2` is the working repo;** original `sojurno` archived/reference. Docs were reconciled into v2 (this ADR added; `redesign-decision.md`, `progress.md`, `architecture.md`, `AGENTS.md` updated to v2 reality).
- **Substrate deps added** (all owner-approved here): Tailwind v4 (`@tailwindcss/vite`), Radix primitives, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`; ESLint toolchain. This supersedes the original AGENTS.md "no new runtime deps" rule for these named additions.
- **Tokens are interim SCSS** (`_tokens.scss`) consumed via `@theme inline`; the DTCG → Style Dictionary pipeline is a tracked foundation task that will make `_tokens.scss` generated output again.
- **Imagery deviation (interim):** v2 uses **Unsplash** imagery for the first production take, explicitly owner-approved, deviating from ADR-0016's no-stock rule. AI-generated static listing assets remain the intended end state; this is recorded as a deviation, not a reversal of ADR-0016's principle.
- **i18n extended to EN/ES/FR.**
- **Pending to reach the bar:** DTCG pipeline reinstatement, Figma Code Connect + library, GitHub Actions CI, fuller Storybook variant coverage, remaining visual-parity passes (see `progress.md`).
- **ADR-0002 / ADR-0016 reaffirmed:** engine/tenant separation and the i18n chrome/content split hold; the Unsplash deviation is the one tracked exception, time-boxed to the asset-generation work.
- **ADR-0014:** visual values/type/brand model superseded; governance principle stands. **ADR-0007:** Storybook launchpad stays and gains shadcn + (planned) Code Connect as the documented system.

## Phasing (build sequence — kit before pages)
- **A — Foundation.** Reinstate DTCG → Style Dictionary over the `@theme inline` bridge (`_tokens.scss` becomes generated); add GitHub Actions CI. Verify tenant×theme still composes.
- **B — Base component library (the heart).** shadcn primitives themed via tokens, each with documented cva variants + Storybook + a11y; bespoke components to convention.
- **C — Figma round-trip.** Build/sync the Figma library from code; wire Code Connect `.figma.tsx` mappings (bidirectional), fed by the token variables.
- **D — Page composition.** Bring landing, Explore, listing detail, host dashboard, footer, About to full visual parity with the redesign.
- **E — Content & imagery.** Swap Unsplash for AI-generated static assets per ADR-0016.

Each phase: commit referencing ADR-0019, `progress.md` updated, hard stop at the boundary.
