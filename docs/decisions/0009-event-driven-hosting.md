# ADR-0009 — Event-driven hosting as a future capability

**Status:** Proposed · **Date:** 2026-06-13

> Captured from a working-session observation: Airbnb campaigning to vet hosts to open their homes for the World Cup. The insight — affinity communities are *already* event-timed (runners converge on races), so event hosting is the always-on version of what Airbnb does as a one-off scramble.

## Context
The platform's tenants are communities of shared interest (→ ADR-0001), and tenant differences are expressed as composable capability modules (→ ADR-0004), with gear as the first such module (→ ADR-0003). Separately, real demand in P2P stays spikes around *events*: a marathon weekend, a trail ultra, and — at the extreme — something like a World Cup, for which Airbnb actively recruits and vets hosts.

Two observations make events a natural fit rather than a bolt-on:
- **Affinity is already event-shaped.** A community is *who*; an event is *when that community converges on one place*. The runners tenant is implicitly active around race season. Events make that explicit.
- **Trust is pre-solved here.** Airbnb must *campaign* to vet event hosts because host and guest are strangers. On an affinity platform the shared identity already supplies trust, so an event module is a *coordination* problem ("runners hosting runners, this race weekend, this city"), not a cold-recruitment one. The niche that looked like a liquidity limitation becomes the moat the moment an event concentrates demand.

## Decision (proposed)
Model **events as a capability module** — the same shape as gear (→ ADR-0004). A tenant with the events capability gains: events as first-class objects (name, place, date window), listings that can associate with an event, and event-scoped browsing ("stays for the Berlin Marathon, Sept 21"). Not built in v1.

## Why (proposed)
- Reuses the capability pattern exactly — no new architectural concept, just a new module.
- Plays to the platform's core advantage: pre-existing community trust turns event hosting from recruitment into coordination.
- Strengthens the go-to-market story already implied by the runners tenant (race expos, race weekends).

## Alternatives considered
- *Events as a separate product* — rejected: duplicates the engine; ignores that affinity is already event-timed.
- *Events baked into the engine for all tenants* — rejected: violates the engine/tenant line (→ ADR-0002); not every community is event-driven.

## Consequences (if promoted)
- A new `Event` domain object and an `events` capability flag.
- Listing ↔ event association; event-scoped filtering/browse.
- Interacts with the deferred gear-reservation and availability-window seams (→ ADR-0005): event windows are where date/quantity locking would first matter.
- Out of scope for v1; revisit after the two-tenant + gear proof lands.
