# ADR-0005 — Gear is included and flagged, not priced or reserved (v1)

**Status:** Accepted · **Date:** 2026-06-13

## Context
With gear modeled as inventory (ADR-0003), v1 must define how it behaves: does it cost money, and does booking actually reserve it against quantity?

## Decision
For v1: gear is **included / free**, framed as "what your host can lend you." Booking **flags** selected items onto the reservation request — they ride along and surface in the host dashboard — but does **not** lock inventory by quantity. An optional `fee` field exists in the data model but is unused. Quantity reservation is deferred.

## Why
- "Added value" taken literally — included gear is simpler and friendlier than a rental sub-economy.
- Leaving an unused `fee` field and a flag-don't-reserve flow means v2 pricing and inventory locking are *seams*, not migrations.
- Keeps v1 scope honest and shippable.

## Alternatives considered
- *Rental pricing now* — rejected: scope creep, introduces payments semantics prematurely.
- *Full inventory reservation now* — rejected: quantity locking and availability windows are a v2 problem.

## Consequences
- `GearItem.fee` present but unused.
- `ReservationRequest` carries selected gear items.
- Host dashboard shows requested gear per reservation ("Tomás wants: 2 trekking poles, 1 bear canister").
- v2 seams explicitly noted in `architecture.md`.
