# Progress — build status & TODOs

> The living **where-are-we** of the platform build. Read this at the start of any session to find the current state, what's done, and what's open.
>
> For the *what/how* see [`architecture.md`](architecture.md); for the *why* see [`decisions/`](decisions/). This file tracks **state**, not rationale.

## Where we are

**`sojurno-v2` is the trunk** (branch `feat/v2-production-redesign`), per [ADR-0019](decisions/0019-v2-redesign-trunk-and-substrate.md). It is a fresh production rebuild that keeps the original Sojurno architecture (engine/tenant separation, five-axis tenant config, i18n, routing, capability gating) and re-skins it in the `sojurno-redesign` visual language on a **shadcn/Radix + Tailwind v4** substrate. Original `sojurno` = archive/reference; `sojurno-redesign` = visual reference only.

`typecheck` and `lint` are clean. The product surface (landing, communities, start, about, explore, listing, host, design) is routed and rendering; visual parity and the design-system tooling are the open frontier.

## Product spine — re-implemented in v2

The original repo's five phases all have working analogues in v2 (this is config/architecture, not pending work):

| Capability | ADR(s) | State in v2 |
| --- | --- | --- |
| Routing spine — deep-linkable `/t/:tenant/...` | 0006 | ✅ React Router routes live |
| Tenant config + branded app — five-axis typed config, `data-tenant`×`data-theme` | 0002 / 0014 / 0015 | ✅ `src/tenants/`; accent re-points per tenant; **no community-name branching** (verified) |
| Platform shell — `/` landing, `/communities`, `/start`, `/about` | 0015 | ✅ public shell + `CommunityListingRow` rows + 4-col footer |
| Traveler/host split | 0006 | ⚠️ host pages exist via routes; the `role/` dir currently holds the **theme** provider — the `useRole` seam needs confirming/restoring |
| Gear module — capability-gated | 0003 / 0004 / 0005 | ✅ `gear` capability on hikers, off runners; data + types present |
| Design-system launchpad — `/design` → Storybook | 0007 | 🔧 `/design` page exists; Storybook wired; variant coverage partial |

## v2 roadmap (ADR-0019 phasing — kit before pages)

| Phase | Focus | Status |
| --- | --- | --- |
| A | **Foundation** — reinstate DTCG → Style Dictionary over the `@theme inline` bridge (`_tokens.scss` becomes generated); add GitHub Actions CI | ✅ Done (PR #1 merged to `main`; CI green; deployed to Vercel) |
| B | **Base component library** — shadcn primitives themed via tokens, documented cva variants, Storybook + a11y per component. Split: **B1** conventions + harden existing 5 primitives, **B2** wrap in-use Radix (DropdownMenu/Tabs/Checkbox) + Card/Input/Separator, **B3** Select/Switch/Tooltip | ✅ Done (B1–B3; branch `phase-b-component-library`) — 15 documented primitives, story + a11y each |
| C | **Figma round-trip** — build/sync Figma library from code; wire Code Connect `.figma.tsx` (bidirectional) | ⬜ Not started |
| D | **Page composition** — full visual parity (hero, Explore grid/list + filters, listing detail gallery + sticky booking, tabbed host dashboard) | 🔧 In progress |
| E | **Content & imagery** — swap Unsplash for AI-generated static assets (ADR-0016) | ⬜ Not started |

Status legend: ⬜ not started · 🔧 in progress · ✅ done · ⚠️ needs attention · ⏸ blocked.

**Phase done = all true:** `npm run build` passes · `npm run typecheck` clean · `npm run lint` clean · Storybook a11y audit passes for any new/changed component · the engine/tenant line is intact · committed at the boundary referencing the ADR(s).

## Open TODOs & carried-forward seams

- ~~**[Phase A / tokens]** Reinstate the **DTCG → Style Dictionary** pipeline so `src/styles/_tokens.scss` becomes generated output.~~ ✅ Done on `phase-a-tokens`: `tokens/*.json` (primitives + semantic light/dark + per-tenant) → `tokens/build-tokens.mjs` → generated `src/styles/_tokens.scss` (git-ignored, built by `npm run tokens`, auto-run via `pre*` hooks). `[data-community]` tints now reference token primitives (hex lives only in `primitives.json`). **Still open:** the Figma-variable export (with light/dark/tenant modes) for the Code Connect round-trip — lands in Phase C.
- ~~**[Phase A / CI]** Add **GitHub Actions** running `typecheck → lint → build → storybook a11y` per PR.~~ ✅ Done: `.github/workflows/ci.yml` (verified locally; first remote run on push/PR).
- **[Phase C]** **Figma Code Connect** — `.figma.tsx` per component + a synced Figma library. Not started.
- **[Role seam]** The `role/` directory currently exports the light/dark **theme** provider (`ThemeProvider`/`useTheme`), not the traveler/host **role** abstraction (`RoleProvider`/`useRole`) the original had. Host pages exist via routes; confirm whether the role toggle is intended for v2 and restore the seam if so (→ ADR-0006).
- **[Imagery]** v2 renders **Unsplash** images (`ListingCard` `<img src={listing.images[0]?.src}>`) as an owner-approved interim. Swap for AI-generated static assets per ADR-0016; there is no `Scene` fallback component in v2 (the original's generative `Scene` was not carried over).
- **[Storybook]** Document Button/Badge/Card/Search/Row/Footer/About and all primitive variants/states; this pass prioritized screen fidelity.
- **[Visual parity]** Full-bleed photographic hero, darker community-builder module, richer Explore controls, listing detail gallery, host dashboard refinements (per `v2-build-note.md`).
- **[Search/dates]** Decide whether the landing search/date controls stay lightweight (demo) or become real interactive inputs.
- **[Post-v1]** Per-tenant **typography** (curated font pairings) — gated on a font loading/performance decision (ADR-0014 seam).
- **[Generator]** Separate AI listing-asset generator app (own repo) emitting to the canonical `Listing` schema.
- **[Profile]** `/t/:tenant/profile` route is intentionally **omitted** until a profile page is specced.
- **[QA]** No browser automation installed (Playwright absent); responsive visual QA is manual/user-assisted.
- **[Housekeeping]** Decide whether `.claude/` should be git-ignored or tracked.

## Decision log pointers

- **Accepted, implemented (foundation):** **v2 as trunk + redesign visual language + shadcn/Tailwind substrate** (ADR-0019, supersedes the *visual layer* of ADR-0014, revisits ADR-0007's substrate). `sojurno-v2` is trunk; Instrument Serif + Plus Jakarta Sans; neutral base + community **accent**; retire "arch" radius. Substrate **shadcn/Radix + Tailwind v4** with tokens fed via `@theme inline`. Tokens are **interim hand-authored SCSS**; **DTCG → Style Dictionary pipeline scheduled for reinstatement** (anchors the Figma round-trip). i18n **EN/ES/FR**, globe-icon dropdown (built). **Unsplash imagery** is an owner-approved interim deviation from ADR-0016. Code Connect + CI pending. Trunk analysis: [`redesign-decision.md`](redesign-decision.md).
- Accepted: **tenant brand axis = logo + color + typography**, bounded to token slots (ADR-0014, extends ADR-0002); typography shipped as a seam. ADR-0019 supersedes its visual *values*; its governance principle stands.
- Accepted: **listing content model** (ADR-0016). Listings may carry **AI-generated photorealistic images** made offline, no runtime AI, no stock/scraped. **Marketplace content single-language**; chrome bilingual. *v2 interim:* Unsplash imagery is used until the generator lands (recorded in ADR-0019 as a tracked deviation).
- Accepted: **platform shell vs tenant app** (ADR-0015, extends ADR-0006). `/` landing + community gallery, `/communities`, `/start` informational; reservations stay in the tenant flow; two header contexts.
- **Proposed, parked (post-v1):** **persistence & backend** (ADR-0017) — Supabase + Vercel functions, tenant RLS, generator-as-preloader. Not built; roadmap stays on static/mock data. The dormant best-practice categories (waterfalls/server/data-fetching) activate with this.
- **Accepted, built:** **Collections discovery rail** (ADR-0020, promotes & generalizes ADR-0009). A `collections` capability + generic `Collection` (`kind: event | place`); tenant-scoped curated groupings (runner races, hiker trails/parks) shown as a horizontal poster rail atop Explore, each linking to a detail page of associated listings. Engine/tenant-clean; mock data (ADR-0017 stays parked). Supersedes ADR-0009's Event→Collection shape; host-run event *mechanics* remain out of scope.
- **Proposed:** **linked listings** (ADR-0018) — host links their **own** external listing (`bookingMode` + `externalUrl`), booking is an outbound link, host-entered data only (no scraping). Needs acceptance, then a build phase.
- Proposed / not-in-v1: **iCal availability sync** (ADR-0012). Rejected: **external-listing ingestion** (ADR-0013), **events** (ADR-0009), **AI intent search** (ADR-0010). See [`AGENTS.md`](../AGENTS.md) §8.

## Changelog (recent first)

- **2026-06-18** — **Phase C kickoff: componentization (C0 + C1)** on `design-system` (→ ADR-0019, [`design-system.md`](design-system.md)). Wrote the design-system spec (layering, variant-naming conventions that become Figma variant names, primitive inventory, extraction audit, Figma mapping, C0–C4 sequence). C1 extractions: new `Eyebrow` + `SectionHeader` primitives (stories + barrel), adopted across all pages (replacing 14 hand-rolled eyebrows + the per-page header clusters); merged `UpcomingCommunityCard` into one `CommunityCard` with active/upcoming states; folded stray chips into `Badge`. `MediaTile` + broad `Card` adoption deliberately deferred (documented). Next: C2 Storybook variant coverage → C3 Figma library → C4 Code Connect. typecheck/lint/build green.


- **2026-06-18** — **Collections discovery rail built** on `collections` (→ ADR-0020, which promotes & generalizes ADR-0009). New `collections` capability (on for runners + hikers); generic `Collection` type with `kind: event | place`; mock `COLLECTIONS` (runner races, hiker trails/parks) associating existing listings. New `CollectionCard` (poster-style overlaid tile; accent date chip for events), `CollectionRail` (snap-scroll, label from `vocabulary.collectionsLabel`) at the top of Explore (capability-gated), and `CollectionDetailPage` at `/t/:tenant/collections/:id` (serif hero + filtered listings via `ListingCard`). Engine/tenant-clean (no name branching). Mock data; ADR-0017 persistence stays parked. i18n EN/ES/FR. typecheck/lint/build green. Designed with the `frontend-design` skill (poster tiles distinct from product cards). Pending: review/merge.


- **2026-06-17** — **Phase B3 (remaining primitives)** on `phase-b-component-library` (→ ADR-0019). Added `Switch`, `Tooltip` (+Provider/Trigger/Content), and `Select` (Trigger/Value/Content/Item) themed wrappers + Storybook stories (a11y:error). Installed `@radix-ui/react-{select,switch,tooltip}` (within ADR-0019's pre-approved Radix category). Additive/documented — no app consumers yet, so they tree-shake out of the app bundle (unchanged at ~367 kB). **Phase B complete: 15 documented primitives, a story + a11y per component.** Next: Phase C (Figma round-trip).
- **2026-06-17** — **Phase B2 (Radix wrappers + card consolidation)** on `phase-b-component-library` (→ ADR-0019). **B2a:** themed wrappers around the in-use Radix primitives — DropdownMenu, Tabs, Checkbox, Dialog — each with a Storybook story (a11y:error); refactored the raw usages (CommunityMenu + LanguageSwitcher → DropdownMenu, consolidating duplicated chrome; HostDashboard → Tabs; ListingPage gear → Checkbox); made `Button` forwardRef for `asChild` composition. **B2b:** `Card` (cva padding/elevation + asChild), `Input`, `Separator` primitives + stories; refactored the repeated `rounded-xl border bg-card p-5 shadow-sm` pattern (Metric, ReservationCard, Panel, sticky aside) onto `Card`. Wrappers are plain function components so `react-refresh/only-export-components` stays clean. typecheck/lint/build/storybook all green. B3 (Select/Switch/Tooltip — need new Radix deps) pending.
- **2026-06-17** — **Phase B1 (component-library conventions)** on `phase-b-component-library` (→ ADR-0019). Locked the primitive convention (cva variants + token-backed Tailwind + `cn`); converted `Badge` (tone variants) and `Avatar` (size variants + optional image) to cva; added Storybook stories with `a11y: { test: 'error' }` for Avatar, Rating, Stepper (Button/Badge already had them); added `src/lib/index.ts` as the side-effect-free public-API barrel (components only — utils stay direct per the react-refresh rule). typecheck/lint/build/storybook all green. B2 (wrap in-use Radix + Card/Input/Separator) and B3 (Dialog/Select/Switch/Tooltip) pending.
- **2026-06-17** — **Phase A merged** (PR #1 → `main`); CI green; v2 deployed to Vercel (`sojurno.vercel.app`) after repointing the existing Vercel project to the new repo. Original repo renamed `sojurno-poc`; fresh public `vinceang/sojurno` is the trunk.
- **2026-06-17** — **Phase A (Foundation) built** on `phase-a-tokens` (→ ADR-0019). Reinstated the DTCG → Style Dictionary token pipeline: `tokens/*.json` (primitives + semantic light/dark + 4 per-tenant accent overrides) compiled by `tokens/build-tokens.mjs` into a git-ignored `src/styles/_tokens.scss`, consumed by the existing Tailwind `@theme inline` bridge — values reproduce the prior hand-authored tokens exactly (no visual regression). `[data-community]` tints re-pointed to token primitives (hex now lives only in `primitives.json`). Added `npm run tokens` + `pre*` hooks (dev/build/storybook) and a GitHub Actions CI workflow (`typecheck → lint → build → storybook a11y`); all four green locally. Figma-variable export (with modes) deferred to Phase C.
- **2026-06-17** — **Docs reconciled to v2 reality.** Added [ADR-0019](decisions/0019-v2-redesign-trunk-and-substrate.md) (v2 as trunk; shadcn/Tailwind substrate; redesign visual language; DTCG reinstatement + Code Connect + CI scheduled; EN/ES/FR; Unsplash interim). Flipped `redesign-decision.md` to RESOLVED. Rewrote this file's phase model and open seams to match v2. Updated `architecture.md` and `AGENTS.md` to the v2 substrate (Tailwind/Radix/cva, interim SCSS tokens, EN/ES/FR, Unsplash interim).
- **2026-06-17** — v2 redesign implementation pass on `feat/v2-production-redesign`: fresh React/Vite production build keeping Sojurno's affinity/multi-tenant thesis while translating the Figma Make redesign into production patterns. Real routes, EN/ES/FR chrome, tenant-scoped listing data, public header/footer, `/about` maker page, reusable `CommunityListingRow` landing sections, builder CTA strip. Consolidated primary CTA styling through the `Button` primitive after finding `Button asChild` links lost contrast to the global anchor reset. State: promising but incomplete (visual parity, Storybook coverage, search/date behavior, richer Explore/detail/host views, browser QA all open). See [`v2-build-note.md`](v2-build-note.md).

> Historical changelog for the original `sojurno` repo (Phases 1–5, June 14–16) lives in that repo's `docs/progress.md`; v2 re-implements that spine rather than continuing its branch/PR history.
