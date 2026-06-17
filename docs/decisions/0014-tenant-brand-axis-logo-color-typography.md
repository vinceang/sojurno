# ADR-0014 — Tenant brand axis: logo, color, and typography, bounded to token slots

**Status:** Accepted · **Date:** 2026-06-14

> Extends ADR-0002's brand axis. ADR-0002 defined brand as "the semantic token layer (the community's identity)" but did not enumerate what that layer contains or how far per-tenant freedom extends. This ADR specifies it — and draws the line that keeps configurability from becoming a free-for-all.

## Context
The platform must let communities feel like genuinely different products, and the in-app tenant switch is the headline demo — a flip that visibly transforms the experience. The open question was *how much* a tenant may change. Too little (a single accent hue) is indistinguishable from a reskin and makes the demo fall flat; too much (arbitrary per-component styling) is the "MySpace mistake" — unbounded freedom that destroys coherence and the accessibility floor.

Three expressive layers were identified as wanted per-tenant: **logo**, **color scheme**, and **typography**. Typography is the highest-cost and highest-risk of the three (per-tenant font loading, FOUT/FOIT and performance, fallback stacks, and the discipline of not letting fonts break the shared type scale).

## Decision
The brand axis is **logo + color + typography**, each configurable per tenant **only through fixed token slots** — never as free-form styles on components or layout.

- **Logo** — an asset slot with size/clear-space constraints (the wordmark/mark). v1: **configurable per tenant.**
- **Color** — a tenant palette that re-points the shared semantic `--color-*` roles, composing `data-tenant` with `data-theme` (per ADR-0002 / architecture.md). v1: **configurable per tenant.**
- **Typography** — bound to **curated font pairings (display + body) swapped at the family level**. The *type scale* (sizes, line-heights, weights mapped to roles) stays engine-owned and shared. v1: **shipped as a designed seam** — the `typography` field exists in the tenant config and the engine reads it, but all tenants ship the **same shared Sojurno type system**; per-tenant fonts are deferred post-v1.

The **structural system stays shared and engine-owned**: layout, spacing, type scale, the component library, and the accessibility floor. Tenants vary the three expressive layers; they never touch structure.

**Sojurno is the base.** Sojurno is the default brand and the reference foundation; runners and hikers are brand *overrides* on top of it.

## Why
- **It is not a deviation from ADR-0002** — logo, color, and typography all live inside "the semantic token layer." This ADR specifies that layer and bounds the freedom; it does not change direction.
- **The guardrail is *where* config plugs in, not *how many* knobs exist.** Values flowing into fixed token roles stay coherent by construction; arbitrary component styles do not. This is how multi-brand design systems work (shared components, sub-brands varying mark/color/type) and is precisely the anti-"MySpace" line.
- **A big demo difference is already met without per-tenant typography.** A tenant switch swaps logo, re-resolves the full color scheme, changes vocabulary/trust signals (ADR-0002), and toggles the gear capability (ADR-0004). Typography adds polish but carries the least differentiation punch at the highest cost.
- **Seam over migration.** Shipping `typography` as a present-but-shared field mirrors the unused `GearItem.fee` seam (ADR-0005): the platform *supports* per-tenant type — it's in the types and the pipeline — with zero v1 font-loading/performance cost. Lighting it up later is a config change, not a refactor.

## Alternatives considered
- *Single accent hue only* — rejected: too close to a reskin; weak tenant switch.
- *Fully free-form per-tenant styling (arbitrary fonts/colors/layout)* — rejected: the MySpace mistake; destroys coherence and the a11y floor.
- *Build per-tenant typography in v1* — rejected for v1: highest cost (font loading, performance, scale discipline) for the least added differentiation; deferred as a seam, not dropped.

## Consequences
- The Phase 2 tenant brand config schema is shaped as `{ logo, colors, typography }` — each a bounded, token-mapped shape, not an open style object.
- v1 builds **logo + color** as live per-tenant config; **typography** ships as a schema field that all tenants resolve to the same shared Sojurno type system.
- Per-tenant fonts become a post-v1 task gated on a font loading/performance decision; recorded as a seam, not a migration.
- The structural system and a11y floor remain engine-owned; no tenant config may override them.
- Accepted; in scope for v1 and binding on the Phase 2 brand config schema.
