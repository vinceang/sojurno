# ADR-0015 — Platform shell vs. tenant app: information architecture and the front door

**Status:** Accepted · **Date:** 2026-06-14

> Extends ADR-0006 (routing, tenant resolution, traveler/host). ADR-0006 established React Router and path-based tenant resolution but framed `/` loosely and never described what sits *above* the tenants. This ADR defines that layer — the platform shell — and the site's information architecture.

## Context
ADR-0006 left `/` as a bare redirect into a tenant (`/t/runners/explore`). That quietly erases a real distinction: **Sojurno-the-platform** is its own surface, separate from any one community. A visitor landing on Sojurno should first understand *what the platform is* — communities of shared interest where host and guest belong to the same group — and be able to see the communities and learn how affinity groups work, before dropping into a single community's app. Conflating the two flattens the "one platform, many communities" thesis (ADR-0001) into "a runners app with a weird URL."

This also clarifies the engine/tenant line (ADR-0002): the platform shell is **pure engine in the Sojurno base brand**; tenants are the branded apps entered *through* it.

## Decision
Split the product into two clearly separated surfaces:

1. **Platform shell** — tenant-agnostic, Sojurno base brand. The front door.
   - `/` — **landing**: a hero that states what Sojurno is, plus a **gallery of properties categorized by community** (a row-per-tenant, horizontally-scrollable "Netflix-style" layout). Tapping a property enters that tenant's flow. The gallery doubles as a soft directory.
   - `/communities` — **directory**: community-forward view (what each community is, its affinity and trust signals, an "enter community" action, and the start-a-community CTA).
   - `/start` — **"Start an affinity group": informational only** in v1 (see below).
2. **Tenant app** — per-community, tenant-branded. Everything that happens *inside* a community: browse stays, listing detail, **reservations**, host dashboard — all under `/t/:tenant/...`.

**Reservations happen in the tenant flow**, never at the platform level — you book within the community you entered.

**Two header contexts.** The platform shell carries a Sojurno-branded header (explore communities · start a community · about); the tenant app keeps the tenant-scoped header (explore stays · host · tenant switcher). The current `Header` becomes the *tenant* header; a lighter *platform* header is added.

**Community creation is informational in v1.** `/start` describes how affinity communities work with a "get in touch / coming soon" call to action. No tenant is actually created. The real creation flow is **deferred until the tenant-configuration surface is understood** — we cannot design "create a community" before we know what a community can configure, and that won't be clear until the build takes shape. This is a documented seam, not a built feature (cf. the dormant AI-search entry point, AGENTS.md §8).

## Why
- **Tells the story in one screen.** A row-per-community landing gallery sells the platform thesis (communities of stays) and previews tenant differentiation — strong demo and case-study material.
- **Honors the engine/tenant line.** The shell is the Sojurno base brand ("base first"); tenants override only inside their app. The two-header split reinforces, rather than blurs, the boundary.
- **Scopes honestly.** Real community creation is the platform's entire supply-side onboarding — out of scope for the demo. Deferring it until tenant config is fleshed out is a deliberate sequencing judgment, not an omission.
- **Front door over redirect.** A landing that explains the product is a legitimate production entry point *and* a far better first impression than an immediate redirect into one community.

## Alternatives considered
- *Keep `/` as a redirect into a default tenant* (status quo from Phase 1) — rejected: hides the platform, weakens the thesis.
- *Single shared header across platform and tenant* — rejected: the two contexts have different nav and different brand scope; one header would muddle both.
- *Build a working community-creation flow now* — rejected: depends on a tenant-config surface that doesn't exist yet; large supply-side scope; premature.
- *Landing gallery only, no `/communities` directory* — rejected: the directory's community-forward framing (affinity, trust, "enter") does a job the property gallery doesn't.

## Consequences
- The Phase 1 `/` → tenant redirect is replaced by the platform landing; the router gains platform routes (`/`, `/communities`, `/start`) alongside the tenant routes.
- **Listings gain a tenant association.** The categorized gallery and the per-tenant app both require each listing to know its community; the flat POC `LISTINGS` array is tagged with a `tenant` and split across runners and hikers.
- A **platform header** is added; the existing header becomes tenant-scoped.
- `/start` ships as an informational page; the community-creation flow is an explicit, documented seam to revisit once tenant configuration is understood.
- Suggests sequencing the tenant work as **Phase 2a** (tenant config mechanism + branded tenant app + listings-by-tenant) and **Phase 2b** (platform shell: landing, gallery, directory, start-info) — to keep each a focused reviewable unit.
- **Entering a community is a signposted threshold, not a jarring swap.** Because only color/logo/(later) type change while the structural system stays shared (ADR-0014), the brand shift reads as "same product, themed for this community." Reinforce it: landing gallery rows preview each tenant's accent (foreshadowing), the tenant header keeps a persistent `Sojurno · {community}` through-line, and the `data-tenant` flip animates via the existing root color transition. Returning to the platform home restores the base brand.
