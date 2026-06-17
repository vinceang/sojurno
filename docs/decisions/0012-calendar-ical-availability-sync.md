# ADR-0012 — Calendar (iCal) availability sync

**Status:** Proposed · **Date:** 2026-06-14

> Origin: the idea of "linking an existing Airbnb listing" so hosts who already list elsewhere don't get double-booked. Reframed here from *listing linking* to *availability sync* — the safe, sanctioned version of the same intent.

## Context
Many prospective hosts already list on Airbnb, VRBO, or similar. The real pain isn't the listing — it's **double-booking** across platforms, and the fear of it is a genuine barrier to adopting a new platform like Sojurno ("what if I lose a booking because two sites didn't know about each other?"). Importing the listing itself is the wrong solution and a legal minefield (see ADR-0013); syncing *availability* is the right one.

## Decision (proposed)
Support **iCal-based availability sync**, read-only with respect to external content:
- **Inbound:** a host pastes an external calendar URL (Airbnb/VRBO/Google export). Sojurno periodically fetches it and blocks those dates on the Sojurno listing.
- **Outbound:** Sojurno exposes each listing's availability as an iCal feed other platforms can subscribe to.

Sync covers **availability only** — never listing content, pricing, or guest data.

This is **engine-level host functionality available across all tenants**, not a tenant capability (contrast ADR-0004's gear module, which differentiates tenants). Any host on any community can use it.

## Why
- **Solves the concrete pain** (double-booking) without poaching listings or fighting anyone's terms of service.
- **iCal is the industry-standard, sanctioned mechanism** — every major platform imports/exports it. No scraping, no fragile third-party API.
- **Bidirectional sync makes Sojurno a good citizen** in a host's multi-platform setup, which directly lowers the "I'll lose bookings" switching risk that suppresses supply.
- **Cleanly distinct from ADR-0013:** this is the host's *own* availability data, host-initiated — not ingestion of the open marketplace.

## Alternatives considered
- *Official platform API integration* — rejected: Airbnb has no public listings API; the only options are unofficial/scraping APIs (fragile, ToS-risky — see ADR-0013).
- *Manual block-out only* — rejected: error-prone and defeats the double-booking protection that is the whole point.
- *Inbound-only sync* — viable as a first slice; the outbound feed is low-cost and completes the good-citizen story, so include it (it can be phased).

## Consequences (if promoted)
- New iCal feed parser, scheduled refresh, and an availability-merge step with conflict resolution and timezone handling at date boundaries.
- The listing availability model must distinguish **Sojurno-native** blocks from **synced-external** blocks.
- Host-facing UI to add/manage calendar connections.
- Out of scope for v1; revisit post-launch.
