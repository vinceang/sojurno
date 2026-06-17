# ADR-0001 — An affinity-based multi-tenant platform, not an Airbnb clone

**Status:** Accepted · **Date:** 2026-06-13

## Context
The project began as a polished but generic P2P stays marketplace (working title *Sojourn*, later renamed — see ADR-0011) — effectively an Airbnb clone built to show frontend craft. A clone proves execution but answers no product question: it has no reason to exist the original doesn't already serve, and "everyone" is not a reachable first audience for a two-sided marketplace. Two-sided marketplaces live or die on trust between strangers and liquidity in a cold start — neither of which a clone can manufacture.

## Decision
Reframe the product as a platform for affinity-based P2P stays: communities of shared interest where host and guest belong to the same group. The platform is multi-tenant — one engine, many communities — shipping with runners as the first tenant.

## Why
- **Trust.** Shared identity is the strongest accelerant in peer-to-peer. A runner hosting a runner brings course knowledge, gear, and race-day logistics no generic listing can fake.
- **Go-to-market.** A niche is reachable — running clubs, race expos, Strava — where "everyone" is not.
- **Positioning.** "I cloned Airbnb" shows execution; "I found trust as the wedge in P2P and built an affinity platform" shows product thinking — the difference that matters at staff/principal level.
- **Platform over single app.** Making the interest group a configuration axis turns the niche from a limitation into proof of a reusable system.

## Alternatives considered
- *Single-app clone* — rejected: no thesis, weaker signal.
- *One beautifully-specific runners app* — rejected for v1: one tenant proves a skin, not a platform.
- *Separate builds per community* — rejected: duplication, and it hides the platform story.

## Consequences
- A hard line between a tenant-agnostic engine and per-tenant config becomes the central constraint (ADR-0002).
- v1 must ship two tenants, not one (ADR-0004).
- Profiles and identity become first-class, not decorative.
- Cold-start liquidity is a real risk for a production venture — out of scope for the demo, noted honestly.
