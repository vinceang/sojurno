# ADR-0003 — Gear is inventory, not an amenity

**Status:** Accepted · **Date:** 2026-06-13

## Context
The hikers tenant introduces host-lent gear — tents, extra backpacks, bear-proof food containers, trekking poles, portable stoves, GPS units — things travelers often can't pack from home. The path of least resistance is to model these as more amenity chips.

## Decision
Model gear as its own typed domain object — inventory. Each item is countable, categorized, host-owned, loanable, with an icon and an optional (initially unused) fee field.

## Why
- Amenities are *binary facts about the house* ("has wifi"). Gear is a *countable, host-owned, optional* thing with category and quantity — a different data shape entirely.
- Shoehorning gear into amenity chips flattens it into a feeling; as its own object it flows meaningfully into the listing page, the booking flow, and the host dashboard.
- It is the first tenant difference that is **structural**, not cosmetic — the proof that tenants can enable different *capabilities*, not just different paint (ADR-0004).

## Alternatives considered
- *Amenity chips* — rejected: flat, loses quantity and category.
- *Freetext "gear available" field* — rejected: unstructured, can't drive booking or dashboard UI.

## Consequences
- A new `GearItem` type enters the domain model.
- Gear renders as its own section on the listing page and host dashboard.
- Selected gear rides along on the reservation request (ADR-0005).
