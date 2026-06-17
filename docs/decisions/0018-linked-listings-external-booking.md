# ADR-0018 — Linked listings: host-owned, externally-booked (e.g. Airbnb) stays

**Status:** Proposed · **Date:** 2026-06-16

> Updates ADR-0013. The origin is a real exchange in a RunDisney Facebook group: members joke about being priced out or sold out of hotels — "*can I stay with you… lol*" — and someone replies, "*I actually run an Airbnb…*". That's Sojurno in one thread: an affinity community already trying to solve its own travel, informally. This ADR lets the platform carry that exchange through to a real, bookable stay **without forcing the host to re-list.**

## Context
Many would-be hosts already list on Airbnb/VRBO. ADR-0013 declined *ingesting/displaying the open marketplace* (scraping, ToS-fragile, off-thesis) but accepted a narrowed alternative: a host importing **their own** listing's data. This story is a sharper, more valuable variant of that alternative:

> *As a host, I want to link my existing Airbnb listing so a fellow community member can book it — and if I don't have one, I can create a stay natively on Sojurno.*

The reframing matters: Sojurno is the **affinity layer** that turns "can I stay with you?" into a bookable stay. Meeting hosts where they already are (Airbnb) is *facilitating the community's travel*, not betraying the thesis (ADR-0001). It directly attacks the cold-start liquidity risk: supply appears with **zero re-listing friction**, and it's a credible funnel to convert Airbnb-only hosts who joined there only because it was the sole option — never because they wanted to host strangers.

## Decision (proposed)
Introduce a **linked (externally-booked) listing** alongside the native one. A `Listing` gains a `bookingMode: "native" | "external"`:

- **native** — booked on Sojurno (the existing flow; the only mode today).
- **external** — the host pastes their **own** listing URL (`externalUrl`); the booking CTA becomes an **outbound deep-link** ("Book on Airbnb ↗") that opens *their* listing. Sojurno is discovery; fulfillment stays on the host's platform.

**Hard line — no scraping/fetching of external content.** The card's content (title, location, a photo or the generative `Scene`) is the **host's own entered data**, never pulled from Airbnb. A plain outbound hyperlink + host-provided data is *not* the ingestion ADR-0013 rejected — that rejection (open-marketplace scraping / unofficial APIs) **still stands**.

Other rules:
- **Clear signposting.** Linked listings are badged ("Booked on Airbnb") so the marketplace is honest about where the transaction happens. **Native stays first-class.**
- **Native-only features stay native.** Gear (ADR-0003/0004), the in-app booking flow, and iCal sync (ADR-0012) apply to native listings. A linked listing carries the community's *affinity and trust* (the host is a member) but not the native booking machinery.
- A linked listing **still belongs to a community** (tenant) — it appears in that community's explore/gallery like any other.

## Why
- **Rounds out the thesis, doesn't dilute it.** The value is the affinity + trust layer ("a runner hosting a runner"); where the payment clears is secondary. The RunDisney anecdote is organic demand evidence.
- **Supply with no friction** — the strongest lever against cold-start liquidity (ADR-0001).
- **Honest conversion funnel** — bridge hosts in via links; native features (gear, community, in-app booking) become the reason to go native later.
- **Legally clean** — a hyperlink to the host's own page + host-entered data sidesteps the ToS/scraping minefield that killed ADR-0013's broad version.
- **Documented judgment evolving in public** — partially reversing a deliberate "no" with a sharper, legal mechanism is strong case-study material (ADR-0008).

## Alternatives considered
- *Scrape/auto-fill from the Airbnb URL (OG tags or listing data)* — rejected: reopens ADR-0013's ToS/fragility; host enters their own data instead.
- *Import the Airbnb listing and book on Sojurno (proxy inventory)* — rejected: payments/ToS complexity, and it's not the host's transaction to intermediate.
- *Native-only (status quo)* — rejected: leaves demonstrated demand and zero-friction supply on the table.
- *Open-marketplace search of Airbnb* — still rejected (ADR-0013 stands).

## Consequences
- `Listing` gains `bookingMode: "native" | "external"` and `externalUrl?` (additive/optional — the canonical schema + the AI generator mirror it; native listings are unaffected).
- The listing booking CTA branches on `bookingMode`; cards carry a "Booked on Airbnb" badge; a host entry point offers "link your existing listing **or** create one here."
- **Trust caveat:** linked listings aren't Sojurno-verified/reviewed/paid; surfaced honestly, never blended invisibly with native ones.
- **Updates ADR-0013:** its accepted narrowed alternative is broadened to allow a host's *own* linked, externally-booked listing (host data + outbound link, no scraping). The rejection of open-marketplace ingestion is unchanged.
- iCal sync (ADR-0012) remains the double-booking answer for *native* listings that also live on Airbnb; linked listings book on Airbnb only, so no Sojurno-side conflict.
- **Out of scope:** scraping, transaction/payment capture on linked bookings, availability sync for linked listings.
