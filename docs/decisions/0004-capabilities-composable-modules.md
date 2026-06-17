# ADR-0004 — Capabilities as composable modules; two contrasting tenants in v1

**Status:** Accepted · **Date:** 2026-06-13

## Context
Runners have no gear; hikers do (ADR-0003). The platform needs a way to express tenant differences that go beyond brand, vocabulary, and taxonomy — differences in *what the product can do*.

## Decision
Add **capabilities** as the fifth tenant axis (ADR-0002): an array of optional domain modules a tenant enables. Modules render only when their capability is present. Gear is module one — off for runners, on for hikers. v1 ships both tenants.

## Why
- Upgrades the platform mental model from *skinnable* to *composable* — a meaningfully more senior architecture story.
- One tenant proves a skin; **two contrasting tenants on one engine** prove a platform. The contrast is deliberate:
  - **Runners** — lightweight, urban, race-*timed*. Value = location + race-day logistics. Gear off.
  - **Hikers** — gear-heavy, remote, multi-*day*. Value = trailhead proximity + the kit waiting for you. Gear on.
- Frames runners and hikers as genuinely different products, defusing the "two athletic apps look the same" risk.

## Alternatives considered
- *Scattered feature flags* — rejected: no single source of truth for what a tenant is.
- *Gear always present, hidden by empty data* — rejected: not an honest capability separation; the engine would still carry gear for runners.

## Consequences
- Capability checks gate module rendering across pages.
- v1 scope is firmly two tenants.
- Sets the pattern for future modules (e.g. event/race calendars) as additional capabilities.
