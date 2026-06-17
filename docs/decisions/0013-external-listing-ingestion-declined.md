# ADR-0013 — External listing ingestion: considered and declined

**Status:** Rejected (narrowed alternative accepted) · **Date:** 2026-06-14

> Captured as a deliberate *no*. The idea: let Sojurno search and fetch Airbnb listings by event location/date and display them on Sojurno — partly to seed the marketplace with content and generate portfolio material. There is no official Airbnb listings API; only third-party (scraping) services exist.

## Context
A two-sided marketplace looks empty before it has supply, and pulling in existing Airbnb listings is a tempting shortcut to both populate the app and produce something impressive to show. The mechanism would necessarily rely on scraping or unofficial third-party APIs, since no sanctioned listings API exists.

## Decision
**Do not ingest or display external marketplace listings on Sojurno.** Accept a narrowed alternative: a host may import details of **their own** external listing — one-time, host-initiated, their own data — to bootstrap a Sojurno listing.

## Why (the deliberate no)
1. **ToS / legal fragility.** Airbnb has no public listings API by design and actively litigates scrapers; the available third-party APIs scrape under the hood. A *headline* feature built on that can break the day a layout changes or a letter arrives — a fragile foundation for the thing being shown to employers.
2. **It contradicts the thesis.** Sojurno exists because of affinity and trust (ADR-0001). Generic piped-in listings are precisely the impersonal inventory the platform positions *against*; displaying them dilutes the one thing that makes the product make sense.
3. **"It gives us content" is the tell.** That's a *demo-data* problem, not a feature. Generated seed data — already the approach, via the generative SVG scenes — solves the empty-marketplace look with none of the legal or conceptual cost. Don't build a permanent, risky feature to solve a temporary content gap.

## Narrowed alternative (accepted)
A host imports **their own** listing's details (title, description, owned photos, amenities) as an onboarding convenience that reduces listing friction. Legitimate (their content), serves a real host need, and sidesteps every problem above. It is host-data import — a manual paste/upload or at most a host-authorized fetch of their own listing — **not** open-marketplace search.

## Alternatives considered
- *Full external search + display* — rejected (reasons above).
- *Do nothing at all* — viable, but the narrowed self-import is cheap, legitimate host value worth keeping on the table.

## Consequences
- No scraping or third-party listing APIs enter the codebase or dependency tree.
- Empty-state / demo content is solved with generated seed data.
- A future "import your existing listing" host-onboarding convenience may be specced separately, explicitly scoped as host-data import, not marketplace ingestion.
- This ADR stands as documented product judgment — a deliberate scope rejection — which is itself valuable case-study evidence.
