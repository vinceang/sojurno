# Architecture — Affinity P2P Stays Platform

> The living *what/how* of the platform. For the *why* behind any decision here, follow the ADR reference (e.g. → ADR-0002) into `docs/decisions/`.

## Thesis
An affinity-based peer-to-peer stays platform: communities of shared interest where host and guest belong to the same group. One engine, many communities. Shipping with two contrasting tenants — **runners** and **hikers**. (→ ADR-0001)

## The central constraint: engine vs. tenant
Everything hinges on one line:

- **The engine** is tenant-agnostic and shared: the listing/booking/reservation domain, the component library, the page scaffolds (explore, listing, host, profile), routing, the `t()` machinery, and the *primitive* design tokens. It never knows which community it serves.
- **A tenant** is configuration the engine reads. (→ ADR-0002)

If a feature needs to know the tenant's *name*, it's probably in the wrong half.

## A tenant is five axes (→ ADR-0002)
1. **Brand** — the semantic token layer (community identity).
2. **Vocabulary** — i18n overrides + affinity language ("trail-side," "5am-friendly").
3. **Taxonomy** — filters and amenities relevant to the group.
4. **Trust signals** — the proof the community values (e.g. verified Strava link).
5. **Capabilities** — optional domain modules switched on per tenant (→ ADR-0004).

## Capabilities (→ ADR-0004)
Tenant differences go beyond paint: a tenant enables *modules*.

| Tenant | Character | Gear module |
| --- | --- | --- |
| **Runners** | lightweight, urban, race-*timed* — value is location + race-day logistics | **off** |
| **Hikers** | gear-heavy, remote, multi-*day* — value is trailhead + the kit waiting for you | **on** |

Gear is capability module one. (→ ADR-0003, ADR-0005)

## Theme × tenant composition
The POC flips `data-theme` between light and dark. The platform adds `data-tenant`, and the two **compose** (runners-dark, hikers-light). Same Style Dictionary pipeline; the theme work was the rehearsal.

```
primitives (shared)
  └─ semantic[tenant][theme]  →  --color-* re-resolved by attribute
[data-tenant="hikers"][data-theme="dark"]  ← both attributes live on root
```

## Token pipeline (→ ADR-0002)
- **Primitives** — one shared raw palette/scale (DTCG JSON), emitted once.
- **Semantic** — per tenant × theme; re-points the *same* `--color-*` names at different primitives.
- Build loops over tenant configs; output is attribute-scoped CSS custom properties. No component re-renders on switch.

## Routing & tenant resolution (→ ADR-0006)
- **React Router**, real URLs.
- **Path-based tenant resolution**: `/t/:tenant/...` resolved by a `TenantProvider`.
- **In-app tenant switcher** for the demo.
- **Traveler/host = a role toggle inside a tenant** (Airbnb "switch to hosting" pattern), swapping nav + views.
- **Mock role, no auth** in v1.

Proposed routes:
```
/t/:tenant/explore            traveler — browse stays
/t/:tenant/stays/:id          traveler — listing detail + booking
/t/:tenant/host               host — dashboard
/t/:tenant/host/listings      host — manage listings + gear
/t/:tenant/profile            shared — identity + trust signals
/design                       launchpad → Storybook (→ ADR-0007)
```

## Domain model (shape, not final types)
- **Tenant** — `{ id, brand, vocabulary, taxonomy, trustSignals, capabilities[] }`
- **Listing** — engine core; gains `gear?: GearItem[]` when the tenant has the gear capability.
- **GearItem** (→ ADR-0003) — `{ id, name, category, icon, quantity, fee?: number /* unused v1 */ }`
- **ReservationRequest** — gains `requestedGear?: { itemId, qty }[]` (flagged, not reserved → ADR-0005).
- **Role** — `"traveler" | "host"` (mock, no auth).

## Design system (→ ADR-0007)
Out of main nav. Storybook is the canonical documentation; `/design` is a thin launchpad, with a persistent footer link. Component library stays pure and prop-driven so stories render in isolation with the a11y addon auditing each.

## Documentation strategy (→ ADR-0008)
- **Why** → per-decision ADRs in `docs/decisions/`.
- **What/how** → this file.
- **Tenants** → documented *as config* with header comments, not prose.
- **Case study** → synthesized after the build, when before/after visuals and a tenant-switch recording exist.

## Deferred — explicit v2 seams
- Gear **pricing** (the unused `fee` field) and **quantity reservation** (→ ADR-0005).
- **Auth / real identity** behind the mock role (→ ADR-0006).
- Additional tenants and additional capability modules (e.g. race/event calendars) — **event-driven hosting** sketched as a proposed module (→ ADR-0009).
- Cold-start **liquidity** — a real-venture risk, out of scope for the demo (→ ADR-0001).

## Inheritance from the POC
The visual language, generative SVG scenes, EN/ES i18n, dark mode, and the token pipeline all carry over from the original prototype. This document describes the *restructure and extension* on top of that foundation, not a rebuild.
