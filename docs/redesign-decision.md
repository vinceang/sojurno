# Redesign decision — trunk choice (working note)

> **Status:** RESOLVED → **Path A, executed as a fresh repo.** Formalized in [ADR-0019](decisions/0019-v2-redesign-trunk-and-substrate.md) (Accepted 2026-06-17).
> **Date:** 2026-06-17. Kept as the rationale record behind the ADR.
>
> **Outcome:** Rather than edit the original repo in place, the owner rebuilt Path A as **`sojurno-v2`** — the redesign's look-and-feel re-implemented on the original's architecture (engine/tenant separation, typed tenant config, i18n, routing) read from its ADRs. `sojurno-v2` is now the **trunk**; original `sojurno` = archive/reference; `sojurno-redesign` = visual reference only. Substrate is **shadcn/Radix + Tailwind v4** via a `@theme inline` bridge, with tokens as an **interim hand-authored SCSS** layer and the **DTCG → Style Dictionary pipeline scheduled for reinstatement** (it anchors the Figma Code Connect round-trip, which remains a goal). i18n extended to **EN/ES/FR**; **Unsplash imagery** is an owner-approved interim deviation from ADR-0016. See ADR-0019 for the full decision and phasing.

## 0. The question on the table

Vince has a **redesigned** version of Sojurno (a Figma Make export) whose **visual design and some concepts he likes more** than the current build. Two paths:

- **A — Bring this repo up to speed design-wise** (keep `sojurno` as trunk, port the redesign's look + IA into it).
- **B — Grow the redesigned repo** (make `sojurno-redesign` the trunk, port this repo's architecture/concepts into it).

Vince leans B by gut but asked for honest input. After reading both repos in full, **my recommendation is A** (with one swing factor — see §5/§6).

## 1. The two repos

### `sojurno` (this repo) — the functional trunk
- 5 phases built (routing spine, tenant config + platform shell, traveler/host split, gear module, design-system launchpad). ADR-governed (`docs/decisions/`), phase-disciplined, `docs/progress.md` is the living status.
- **Architecture is the asset, and it's working code, not just docs:**
  - Engine/tenant separation (ADR-0002): engine never branches on tenant name; differences = config + capability flags.
  - Five-axis tenant model (brand, vocabulary, taxonomy, trust signals, capabilities); typed registry in `src/tenants/`.
  - Token pipeline: DTCG JSON → Style Dictionary v4 → `src/styles/tokens.css`, attribute-scoped (`:root`, `[data-theme="dark"]`, `[data-tenant="X"]`), composition by CSS specificity.
  - i18n contract: `t()`, `en`/`es`, chrome bilingual / marketplace content single-language (ADR-0016).
  - URL routing: React Router v6, deep-linkable `/t/:tenant/...`.
  - Capability gating (`tenant.capabilities.includes("gear")`).
  - Content model (ADR-0016): AI-generated-offline images + `Scene` fallback; **no stock/scraped imagery**.
- **Weaker visual skin** than the redesign.

### `sojurno-redesign` (`/Users/vincentang/Documents/projects/sojurno-redesign/sojurno-redesign`) — the design asset
- Figma Make export. **Single `src/app/App.tsx`, ~1858 lines** — all data, pages, components inline. Full shadcn/Radix UI library under `src/app/components/ui/`. Tailwind v4 + (unused) MUI. pnpm.
- Has `CLAUDE.md` + `guidelines/Guidelines.md` documenting its design system intent.
- **Design language is genuinely better** (this is the thing worth keeping):
  - Palette: warm off-white `#FAFAF8` / near-black `#1A1916`, card `#fff`, secondary `#F4F2EE`, muted `#EDEBE6`, radius `0.875rem`.
  - Type: **Instrument Serif** (display/headings/wordmark, italic wordmark) over **Plus Jakarta Sans** (body/UI).
  - Community accents: runners `#E8651A`/`#FEF3EC`, hikers `#2D6A4F`/`#EEFAF4`, cyclists `#1A56DB`, climbers `#9333EA`.
  - Components/screens we like: equal-height `ListingCard` (title `min-h-[2.5rem]`, price pinned `mt-auto` on its own row), scalable **community dropdown**, **Explore** with grid/list toggle + filter bar + sort, gallery-grid **listing detail** with sticky booking panel, **tabbed host dashboard** (reservations/requests/listings), **About/maker** page, real 4-col **SiteFooter**, "How it works" band, dark CTA module.

## 2. The catch — the redesign's architecture is the opposite of ours

Its own docs **institutionalize the anti-patterns** our ADRs exist to prevent:
- **Engine branches on community name everywhere** — `community === "runners"` / `=== "hikers"` scattered through Explore, listing detail, amenities, reviews. `CLAUDE.md` §7 tells you to edit `ExplorePage` to add a community. That's the MySpace mistake (ADR-0002) written in as the intended pattern.
- **Community colors hardcoded inline by design** — guidelines codify "accent colors passed inline (not CSS variables)." Inverse of our token pipeline. No dark mode, no token build.
- **No capability model** — gear is `community === "hikers"`, not a `capabilities` flag. No vocabulary/taxonomy/trust-signal axes.
- **No i18n** (English-only hardcoded strings), **no URL routing** (`page` useState; React Router 7 installed but unused), **live Unsplash hotlinks** for images (the stock/scraped path ADR-0016 rejected).
- Single 1858-line file; heavy unused deps (MUI, recharts, dnd, carousels).

## 3. The reframe that drove the recommendation

- The redesign's improvements are **presentational** (which screens exist, how they look) — **not architectural**. Presentational things are the *easy* things to carry over.
- The expensive, already-built, hard-to-reproduce asset (correct multi-tenant engine + token pipeline + i18n + routing + ADR governance) lives in **this** repo as **working code**. Rebuilding it inside the redesign repo is the biggest, riskiest chunk — and the redesign's conventions actively fight it.
- So the two repos are **complementary**, and the hard-to-rebuild thing is here.

This is why I reversed my earlier (blind) lean toward B. Seeing the code changed the answer.

## 4. Recommendation — Path A

**Keep `sojurno` as trunk; port the redesign's look + IA into it.**
- Drop the new palette / type / radius / spacing into the **DTCG token source** → it flows everywhere via `data-tenant`, *without* the inline-hardcoded-color anti-pattern.
- Add the net-new screens (About/maker, richer Explore filter bar + grid/list, gallery-grid detail, tabbed host dashboard, footer) as additive work on a correct foundation.
- Result: the exact look Vince liked, on an architecture that doesn't encode the MySpace mistake.

**One sub-decision worth making deliberately:** adopt **shadcn/Radix as the component substrate** (replacing the hand-rolled `src/lib`)? It's the redesign's other real asset and a good foundation. A choice we can make *into* this repo — not a reason to flip the trunk.

## 5. Swing factor — the pivot

The one thing that flips me back to Path B: **Vince's "pivot."** If the pivot throws out most of this repo's functionality anyway, the architecture's value drops and starting fresh on the prettier base gets attractive. Pivot details still unknown.

## 6. How it resolved

The decision was **Path A**, with the swing factor (§5) settled: the product thesis and engine survive — nothing was being thrown away — so the architecture's value held and Path A won. The owner then executed it not by editing the original repo in place, but by standing up a **fresh production repo, `sojurno-v2`**, rebuilt on the redesign's look-and-feel with the original's architecture re-implemented from its ADRs. The side question (shadcn/Radix substrate) resolved **yes**.

Why a fresh repo rather than in-place: a clean Tailwind v4 + Radix + cva scaffold was simpler to stand up than to retrofit onto the original's pure-CSS lib, and it reads as a deliberate, well-structured portfolio build. The risk of starting from a redesign base (importing its anti-patterns) was avoided — v2 was verified to have **no community-name branching** in components or pages.

## 7. What got carried, what changed

**Carried (the asset):** engine/tenant separation, the five-axis typed tenant config (`src/tenants/`), i18n machinery, React Router routes, capability gating (`gear` for hikers), ADR governance, attribute-scoped token cascade (`:root` / `[data-theme]` / `[data-tenant]`).

**Changed / deliberate deviations (all in ADR-0019):**
- Substrate → **shadcn/Radix + Tailwind v4**, fed our tokens via `@theme inline`.
- Tokens → **interim hand-authored SCSS** (`_tokens.scss`); DTCG → Style Dictionary pipeline **scheduled for reinstatement** (needed for the Figma Code Connect round-trip, still a goal).
- i18n → extended to **EN/ES/FR**.
- Imagery → **Unsplash interim**, owner-approved; AI-generated static assets remain the ADR-0016 end state.

## 8. Open work to reach the bar (tracked in `progress.md`)
- Reinstate the DTCG → Style Dictionary token pipeline.
- Figma Code Connect `.figma.tsx` mappings + synced Figma library.
- GitHub Actions CI (`typecheck → lint → build → storybook a11y`).
- Fuller Storybook variant coverage; remaining visual-parity passes (hero, Explore controls, listing detail gallery, host dashboard).
- Confirm/restore the traveler/host **role** seam (the `role/` directory currently holds the light/dark *theme* provider).
- Swap Unsplash for AI-generated static listing assets (ADR-0016).
