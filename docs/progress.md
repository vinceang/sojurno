# Progress — build status & TODOs

> The living **where-are-we** of the platform build. Read this at the start of any session to find the current phase, what's done, and what's open. Update it at every phase boundary (and whenever a TODO opens or closes).
>
> For the *what/how* see [`architecture.md`](architecture.md); for the *why* see [`decisions/`](decisions/). This file tracks **state**, not rationale.

## Current phase

**Phase 4 — Gear module: ✅ built (in review)** on branch `phase-4-gear`. Phases 1–3 ✅ merged to `main` and deployed. Next: **Phase 5 — Design-system launchpad** (final phase).

## Phase status

| # | Phase | ADR(s) | Status | Notes |
| - | ----- | ------ | ------ | ----- |
| 1 | Routing spine | 0006 | ✅ Done (PRs #1–4) | React Router, deep-linkable `/t/:tenant/...` URLs. `:tenant` param inert until Phase 2. |
| 2a | Tenant config + branded app | 0002 / 0014 / 0015 | ✅ Complete (PR) | Five-axis typed config + registry; `TenantProvider` sets `data-tenant` (composes with `data-theme`); token build loops over tenants (override-diff, ember/moss brand primitives); per-tenant color + logo-recolor live; listings tagged by tenant; light affinity vocab; `TenantGuard`. Provider refactor: `.sj-root` + Theme + Tenant in `RootLayout`. Community switching via a **proto-landing at `/`** (one brand-previewing card per community) instead of a header pill; header splits platform vs tenant. |
| 2b | Platform shell | 0015 | ✅ Built (PR #11) | Sojurno front door above tenants: `/` landing (hero + per-community listing rails w/ chevron controls), `/communities` directory (meetup-style cards + "coming soon": Cyclists/Climbers/Surfers/Photographers), `/start` (informational only). Platform header nav (Communities, Start); reservations stay in tenant flow. |
| 3 | Traveler/host split | 0006 | ✅ Done (merged) | Role toggle inside a tenant; mock role, no auth. Role **derived from the URL** (`/t/:tenant/host…` = hosting); "switch to hosting ⇄ traveling" toggle navigates between areas. `RoleProvider`/`useRole`; role-aware header + drawer nav (traveler: Explore; host: Dashboard + Listings). |
| 4 | Gear module | 0003 / 0004 / 0005 | ✅ Built (in review) | `GearItem` typed inventory + shared `GEAR` catalog (bilingual labels, gear icons); `Listing.gear?` on hiker listings, runners none. Capability-gated (`tenant.capabilities`): gear section on the listing with per-item quantity steppers → flagged onto the reservation (no locking); confirm-modal summary; host dashboard shows requested gear; dedicated `/host/listings` page shows gear inventory. Unused `fee` seam holds. |
| 5 | Design-system launchpad | 0007 | ⬜ Not started | Remove "Design System" from main nav; shrink `/design` to launchpad → Storybook; persistent footer link. |

Status legend: ⬜ not started · 🔧 in progress · ✅ done · ⏸ blocked.

**Phase done = all true:** `npm run build` passes · `npm run typecheck` clean · Storybook a11y audit passes for any new/changed library component · the engine/tenant line is intact · committed at the boundary referencing the ADR(s).

## Open TODOs & carried-forward seams

These are deferred items and decisions surfaced in earlier phases that a later phase must pick up. Close them (strike through or remove) when addressed.

- ~~[Phase 2] Replace the `DEFAULT_TENANT` seam with path-based resolution via `TenantProvider`.~~ ✅ Done in 2a (`TenantGuard` + `tenantIdFromPath`).
- ~~[Phase 2] Per-tenant brand: logo + color live, typography as a seam.~~ ✅ Done in 2a (color via `data-tenant` token override; logo recolors via tokens, config carries a `logo` seam; typography shared).
- **[Phase 2b]** Platform shell — expand the proto-landing into the full front door: a **hero**, the **community-categorized gallery** (Netflix-style featured rows), a **`/communities` directory** with **meetup-style cards** and a few **disabled "coming soon" communities** (signals extensibility), and **`/start`** (informational). Flesh out the platform header (communities / start / about). Tenant header already split out in 2a.
- **[Phase 4]** `ListingPage` doesn't verify the listing belongs to the URL's tenant (e.g. `/t/hikers/stays/penedo` renders a runners listing). Add a guard when gear/host work touches listings.
- **[Imagery]** Render `<img>` from `Listing.images` (with `Scene` fallback) in `ListingCard` / `ListingPage` / host thumbnails — wired when real generated assets exist (→ ADR-0016). No listing ships images yet, so `Scene` renders everywhere for now.
- **[Generator]** Separate AI listing-asset generator app (own repo) that emits to the canonical `Listing` schema; build prompt drafted (lives with that project, not here).
- **[Post-v1]** Per-tenant **typography** (curated font pairings, family-level swap) — gated on a font loading/performance decision (ADR-0014 seam).
- **[Rebrand]** Sojurno base visual rebrand (logo + token/feel refresh; name unchanged) — do as a focused pass after the functional spine (Phases 2–5); logo swap can be standalone anytime. Possibly with Claude Design.
- ~~[Phase 4] `/t/:tenant/host/listings` reuses `HostDashboard`; give it a dedicated page when gear lands.~~ ✅ Done in Phase 4 (`HostListingsPage` with gear inventory).
- **[Phase 3+]** `/profile` route is intentionally **omitted** (no `ProfilePage` exists; not inventing scope). Add the route when a profile page is specced/built.
- **[Phase 5]** Main nav still carries "Design System" and `/design` renders the full `DesignSystemPage`; both change when the launchpad lands (ADR-0007).
- **[Housekeeping]** Decide whether the untracked `.claude/` directory should be git-ignored or tracked.

## Decision log pointers

- Accepted, in v1: **tenant brand axis = logo + color + typography**, bounded to token slots (ADR-0014, extends ADR-0002); typography shipped as a seam. Binds the Phase 2 brand config schema.
- Accepted, in v1: **listing content model** (ADR-0016, amends AGENTS.md §6/§5). Listings may carry **AI-generated photorealistic images** made offline (`Listing.images?`), with the generative `Scene` as fallback — no runtime AI, no stock/scraped. **Marketplace content is single-language**; chrome (UI dict, amenity labels, tenant vocabulary) stays bilingual. A **separate AI asset generator** app (its own repo) targets this schema.
- Accepted, in v1: **platform shell vs tenant app** (ADR-0015, extends ADR-0006). `/` = Sojurno landing (hero + community-categorized gallery), `/communities` directory, `/start` informational-only; reservations stay in the tenant flow; listings tagged by tenant; two header contexts; entering a community is a signposted, animated threshold with a persistent `Sojurno · {community}` anchor. Reshapes Phase 2 into **2a** (config + branded app) and **2b** (platform shell).
- **Proposed, parked (post-v1):** **persistence & backend direction** (ADR-0017) — Supabase (Postgres + Auth + Storage) + Vercel functions, tenant isolation via `tenant_id` + RLS, a frontend data-access seam, and the listing generator as an **offline preloader**. **Not built in v1**; the phased roadmap continues on static/mock data. Only cheap now-action: the data-access seam (can ride with a phase). Promote when persistence/auth/admin is actually needed.
- **Proposed:** **linked listings** (ADR-0018, updates ADR-0013) — a host links their **own** Airbnb/VRBO listing (`bookingMode: "native" | "external"` + `externalUrl`); booking is an **outbound link** ("Book on Airbnb"), Sojurno is the affinity/discovery layer. Host-entered data only — **no scraping** (ADR-0013's open-marketplace rejection stands). Needs acceptance, then a build phase.
- Proposed / not-in-v1: **iCal availability sync** (ADR-0012). Rejected: **external-listing ingestion** (ADR-0013), **events** (ADR-0009), **AI intent search** (ADR-0010). Do not build; see [`AGENTS.md`](../AGENTS.md) §8.

## Changelog

- **2026-06-14** — Phase 1 routing spine merged to branch `phase-1-routing` (PR #1): React Router, `RootLayout`, route adapters, `NavLink` header. Follow-ups: shortened search CTA to fix button wrap; mobile header → hamburger drawer (`MobileMenu`) fixing squished/overflowing tools and the nav links that previously vanished at ≤640px.
- **2026-06-14** — Drafted ADR-0014 (Proposed): tenant brand axis = logo + color + typography, bounded to token slots; typography shipped as a seam in v1. Shapes the Phase 2 brand config schema.
- **2026-06-15** — Accepted ADR-0016 (listing content model): `Listing.desc` → single-language `description`, added optional `images` + `Scene` fallback, flattened reviews/dates; chrome stays bilingual. Amended AGENTS.md §6/§5. Separate AI asset-generator build prompt drafted. Drafted **ADR-0017** (Proposed, parked): backend/persistence direction (Supabase + serverless, tenant RLS, generator-as-preloader) — recorded, not built; roadmap stays on the phases.
- **2026-06-14** — Accepted ADR-0014 and ADR-0015. Built **Phase 2a** on `phase-2-tenant-config`: tenant config + registry, per-tenant token composition (`data-tenant` × `data-theme`), `TenantProvider`/provider refactor, listings tagged by tenant, affinity vocab. Replaced the header switcher pill with a brand-previewing **community-card landing at `/`** + a platform/tenant header split. Verified; PR opened.
- **2026-06-15** — Built **Phase 2b** (PR #11): platform shell — landing hero + per-community listing rails (chevron controls, hidden scrollbars, equal-height cards), `/communities` directory (meetup cards + "coming soon"), `/start` (informational), platform header nav.
- **2026-06-16** — Built **Phase 3** (`phase-3-role-toggle`, stacked on 2b): traveler/host role toggle (ADR-0006). Role derived from the URL; `RoleProvider`/`useRole`; role-aware header + drawer nav and a "switch to hosting ⇄ traveling" toggle. Mock role, no auth. Build + typecheck clean (browser smoke test skipped under unattended permissions). Set up an `acceptEdits` + scoped-Bash allowlist in `.claude/settings.local.json` (git-ignored) for unattended work.
- **2026-06-16** — Built **Phase 4** (`phase-4-gear`): gear capability module (ADR-0003/0004/0005). `GearItem` + `GEAR` catalog + gear icons; hiker listings carry gear, runners none; capability-gated gear section with quantity steppers flagged onto the reservation; host dashboard + dedicated `/host/listings` show gear; `fee` seam unused. Build + typecheck clean; dev-server smoke test passed.
