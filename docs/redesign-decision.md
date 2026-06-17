# Redesign decision — trunk choice (working note)

> **Status:** OPEN — awaiting one decision from Vince (see §6).
> **Date:** 2026-06-17. Context-preservation note so we can resume cold.
> Not an ADR yet; becomes one once the trunk is chosen.

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

## 6. DECISION NEEDED FROM VINCE (resume here)

> **How much of what we've built here survives the pivot — basically all of it, or are you reimagining the product?**

That answer, more than the design, decides the trunk:
- *Most survives* → Path A (port design into this repo). My recommendation.
- *Reimagining* → reconsider Path B (grow the redesign, re-impose invariants as Phase 0).

Plus the side question: **shadcn/Radix as the component substrate, yes/no?**

## 7. Once decided — first moves

- **If A:** open an ADR ("redesign visual language adopted; this repo stays trunk; redesign repo = design reference"), then: (1) translate the redesign tokens into the DTCG source + rebuild `tokens.css`; (2) decide shadcn vs hand-rolled lib; (3) restyle existing components to the new language; (4) add net-new screens phase by phase. Keep `sojurno-redesign` as a read-only design reference.
- **If B:** open an ADR ("redesign repo becomes trunk; this repo archived"), copy `docs/decisions/`, `AGENTS.md`, `docs/architecture.md`, `docs/progress.md` over first, then **Phase 0 = architecture audit** re-imposing engine/tenant separation, token pipeline, i18n, routing, capability gating — before any feature work.

## 8. Loose ends in this repo (independent of the above)
- Open PRs to land: **#15** (Phase 4 gear), **#16** (Phase 5 launchpad), **#17** (ADR-0018 linked listings, Proposed). Merge cleanly in any order.
- ADR-0018 (linked listings) is Proposed, not yet accepted/built.
- Tracked seams in `progress.md`: image rendering when assets exist, `/profile` route, ListingPage tenant-guard, `.claude/` gitignore, per-tenant typography (post-v1), Sojurno base rebrand (← the redesign may *be* this).
