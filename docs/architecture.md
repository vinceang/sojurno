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

## Substrate & styling (→ ADR-0019)
v2 runs on **Tailwind v4 + Radix primitives + `class-variance-authority`** (shadcn-style), replacing the original's hand-rolled pure-CSS lib. Tailwind v4 `@theme inline` (`src/styles/tailwind.css`) maps utilities (`bg-background`, `text-accent`, `rounded-lg`…) onto our CSS variables, so every utility resolves to `var(--color-*)` and the cascade still re-points per attribute. We do **not** use shadcn's default theme — it is fed our tokens.

## Theme × tenant composition
`data-theme` (light/dark) and `data-tenant` **compose** (runners-dark, hikers-light): both attributes live on the root and the same `--color-*` names re-resolve by attribute, no component re-render.

```
:root (neutral base + primitives)
  ├─ [data-theme="dark"]                       → base dark
  ├─ [data-tenant="hikers"]                    → community accent re-pointed
  └─ [data-tenant="hikers"][data-theme="dark"] → both live on root
```

## Token pipeline (→ ADR-0019, ADR-0002)
- **Neutral base** semantic tokens in `:root`; **community color is the accent**, re-pointed per `[data-tenant]`.
- **Interim state:** tokens are **hand-authored in `src/styles/_tokens.scss`**, attribute-scoped exactly as above, and consumed via the `@theme inline` bridge.
- **Scheduled:** the **DTCG JSON → Style Dictionary** pipeline is to be reinstated (ADR-0019 Phase A) so `_tokens.scss` becomes generated output and Style Dictionary emits **Figma-compatible variables** for the Code Connect round-trip. Until then, `_tokens.scss` is the source.

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

## i18n (→ ADR-0016)
Chrome is multilingual via `t()` — v2 ships **EN / ES / FR** (French added vs the original's EN/ES). Marketplace content (listing name/description/host/loc, alt text, reviews) is single-language and exempt. The locale switcher is a **globe-icon Radix `DropdownMenu`** calling `setLocale` (`src/components/LanguageSwitcher.tsx`).

## Imagery (→ ADR-0016, ADR-0019)
v2 renders real `<img>` from `Listing.images` — **Unsplash** sources as an owner-approved **interim** for the first production take. The intended end state is **AI-generated static assets** produced offline (ADR-0016). The original's generative `Scene` fallback was **not** carried into v2; if a fallback is needed before the generator lands, it must be reintroduced.

## Relationship to prior repos (→ ADR-0019)
v2 is a **fresh rebuild**, not a restructure of the original. It keeps the original's *architecture* (engine/tenant separation, five-axis config, i18n, routing, capability gating — re-implemented from the ADRs) and the redesign's *visual language*, on a new shadcn/Tailwind substrate. Original `sojurno` = archive/reference; `sojurno-redesign` = visual reference only.
