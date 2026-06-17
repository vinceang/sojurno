# ADR-0016 — Listing content: AI-generated imagery (offline) + content/chrome i18n split

**Status:** Accepted · **Date:** 2026-06-15

> Two coupled decisions about the `Listing` content model: what imagery a listing carries, and how far i18n reaches into listing data. Touches AGENTS.md §6 (generative scenes, no external/stock images) and §5 (the i18n contract), so it is recorded here explicitly rather than changed in code silently.

## Context
The POC models listing imagery as seeded **generative SVG scenes** (`Scene.tsx`), and AGENTS.md §6 says to keep it that way — *"no external/stock images."* That choice deliberately avoided the licensing/identity problems of stock or scraped photos (cf. ADR-0013). But for a marketplace demo, photorealistic property photos read more convincingly, and we want that option without re-introducing stock-image baggage.

Separately, the POC made **all** listing copy bilingual (`desc: Record<Locale, string>`, bilingual reviews). As we move to generating listings at scale (a separate AI asset pipeline), producing every field in two languages is costly and — more importantly — not how real marketplaces work: they localize the **interface** but show listing content in the host's language.

## Decision

### Imagery — AI-generated, offline, with a generative fallback
- A listing may carry **photorealistic images** (`images?: ListingImage[]`), produced **ahead of time** by a separate AI asset-generation pipeline and committed as **static assets**. The public app **never calls AI at runtime**.
- These are **generated**, not stock or scraped — so the spirit of "no external/stock images" (no licensing/ToS exposure) holds; this ADR amends the *letter* of AGENTS.md §6 to allow generated photorealistic assets.
- The generative **`Scene` is retained as the fallback**: when a listing has no `images`, the app renders its seeded `Scene` (keyed by `variant`). So listings can ship without photos and gain them later, and the generative system stays part of the identity.

### i18n — localize the chrome, not the content
- **Chrome/config stays bilingual** (EN/ES): the UI string dictionary, **amenity labels** (typed `AmenityKey` → localized), **tenant vocabulary**, and trust-signal labels. These are finite, authored, and flip with the language toggle.
- **Marketplace content is single-language:** listing `name` / `description` / `host` / `loc`, image `alt`, and review text/dates. This mirrors real platforms (localized UI, host-language listing).
- **Clarification:** the AGENTS.md §5 i18n contract (`t()`, `es` typed against `en`, no inline English) governs **chrome strings**, not marketplace content. Single-language listing data is not a violation.

## Why
- **Generated photos, not stock.** Keeps the convincing-marketplace look while preserving the legal/identity stance ADR-0013 set; nothing scraped, nothing licensed, no runtime AI (consistent with deferring AI features, ADR-0010).
- **Fallback over hard cutover.** `images?` optional + `Scene` fallback means no big-bang asset dependency, graceful degradation, and the seeded-generative system survives as a differentiator.
- **Realistic, cheaper i18n.** Localizing chrome but not content matches user expectations and lets the generator emit one language — simpler pipeline, cleaner data, no translation step. The impressive part of the i18n story (typed dictionaries, full-interface toggle) is untouched.
- **One schema, shared.** The app owns the canonical `Listing`; the generator targets it (its richer draft transforms down on approval), so the two never drift.

## Alternatives considered
- *Keep generative scenes only* — rejected: photorealistic content makes a stronger marketplace demo; we want the option.
- *Stock or scraped photos* — rejected: licensing/ToS exposure and off-thesis (ADR-0013).
- *Replace scenes entirely* — rejected: forces generating images for every listing up front and discards a distinctive system; fallback is better.
- *Fully bilingual content* — rejected: costly to generate, unrealistic, no real payoff over a localized chrome.

## Consequences
- `Listing.desc: Record<Locale,string>` → `description: string`; `Review` and `ReservationRequest.dates` flattened to single-language; existing seed data flattened to EN. `AMENITY` labels stay bilingual.
- New `Listing.images?: ListingImage[]` + `ListingImageType`; `variant` retained (filters + fallback).
- **Seam (not yet built):** rendering `<img>` when `images` is present (with `Scene` fallback) in `ListingCard` / `ListingPage` / host thumbnails — wired when real assets exist. No listing ships images yet, so `Scene` currently renders everywhere.
- The asset generator is a **separate app** that outputs to this schema; it lives with that project, not in this repo.
- Image `alt` is single-language; a11y floor still met (alt present), just not translated.
