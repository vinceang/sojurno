# ADR-0002 — A tenant is configuration across five axes

**Status:** Accepted · **Date:** 2026-06-13

## Context
With multi-tenancy chosen (ADR-0001), the platform needs a precise answer to "what *is* a tenant?" Without one, every new community becomes a code change and the engine/tenant line blurs — which would collapse the whole thesis back into a reskin.

## Decision
A tenant is a typed configuration object spanning five axes:
1. **Brand** — the semantic token layer (the community's identity).
2. **Vocabulary** — i18n overrides plus affinity language ("trail-side," "5am-friendly").
3. **Taxonomy** — the filters and amenities that matter to this group.
4. **Trust signals** — the proof this community cares about (e.g. a verified Strava link).
5. **Capabilities** — optional domain modules the tenant switches on (ADR-0004).

The engine knows none of these specifically; it reads them from config.

## Why
- Keeps the engine tenant-agnostic — the central constraint from ADR-0001.
- Adding a community becomes adding *data*, not code.
- Composes with the existing theme pipeline: primitives stay shared, the semantic layer becomes per-tenant, and `data-tenant` composes with `data-theme` exactly as light/dark already does.

## Alternatives considered
- *Theme-only tenancy (color swap)* — rejected: cosmetic, indistinguishable from a reskin.
- *Hardcoded per-tenant branches in components* — rejected: doesn't scale, pollutes the engine.

## Consequences
- Tenant config is a first-class typed artifact; tenants are documented *as config*, not prose (ADR-0008).
- The token build loops over tenant configs (ADR-0002 feeds the pipeline described in `architecture.md`).
- Five axes set the table for every later tenant-specific decision.
