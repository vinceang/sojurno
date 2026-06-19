# ADR-0023 — No dead-end CTAs: demo affordances & real legal content

**Status:** Accepted · Implemented · **Date:** 2026-06-19

> Generalizes the demo-mode pattern ADR-0021 introduced for "Become a host" into a project-wide convention: every major call-to-action in the prototype resolves to a visible response. No control is inert. Where a destination is not built, the CTA opens a consistent demo affordance — and where a destination conceptually deserves a real page (the footer's legal links), it gets real long-form content rather than a placeholder.

## Context

Sojurno is a portfolio-grade prototype (ADR-0019) with no real backend for bookings, host actions, or community creation (persistence stays parked — ADR-0017). Several major CTAs were wired to nothing, so clicking them did nothing — which reads as "broken" to anyone walking the demo:

| CTA | Location | Before |
| --- | --- | --- |
| Reserve / Request to book (native) | `src/pages/ListingPage.tsx` | no handler — the core conversion CTA |
| Accept / Decline a request | `src/pages/HostDashboardPage.tsx` | no handler |
| Create a community (submit) | `src/pages/StartPage.tsx` | no handler |
| Primary filter pill / sort | `src/components/ExploreFilterBar.tsx` | opens nothing |
| Privacy / Terms / Accessibility | `src/components/Footer.tsx` | all pointed at `/` |

ADR-0021 already solved this for one flow: "Become a host" submits into an honest demo-mode `Dialog` that explains what *would* happen, then proceeds. That pattern is the template; this ADR makes it the rule.

## Decision

### 1. Every interactive CTA resolves — one of three tiers
No major CTA is inert. The response is chosen by the nature of the action:

1. **Demo confirmation `Dialog`** — transactional actions with no destination page (Reserve, Accept/Decline, Create a community). A clean dialog states plainly that this is a demo and what the real action would do. Reuses the ADR-0021 affordance, extracted into a shared `DemoActionDialog` so call sites stay tiny and the copy/craft is consistent.
2. **Real or concept page** — navigational CTAs. Where the destination conceptually deserves a page, build it. The footer's **legal links become real long-form content pages** (Privacy, Terms, Accessibility), not stubs.
3. **Lightweight inline stub** — minor, clearly-unbuilt controls (the Explore filter pills/sort) get a small "coming soon" affordance. Honest and discoverable, without pretending to be built.

### 2. Legal pages are real content, in the shared reading layout
The legal links are an opportunity, not a chore: they demo a **long-form reading layout** the design system otherwise lacks, and exercise the Instrument Serif → Plus Jakarta type hierarchy end to end.

- Content is **clearly-marked sample boilerplate** (a visible disclaimer banner says so) — believable, not real legal text.
- It lives in a structured **per-locale data module** (`src/data/legal.ts`), **not** in `i18n/messages.ts`. The message catalog is a flat `Record<MessageKey, string>` that enforces three-locale parity on every key — a poor fit for multi-paragraph documents. A data module keeps the catalog lean and supports an **English fallback** when a locale's doc is incomplete. This honors ADR-0016 (chrome bilingual EN/ES/FR) — the page *chrome* is fully translated; the long-form *body* is per-locale data with graceful degradation.
- A reusable `.sj-prose` style owns the reading rhythm (capped measure, serif section heads, body leading), built from tokens (ADR-0019 — no raw hex), so future articles can reuse it.

### 3. Honesty over theater
Demo affordances say plainly that they are demos (following ADR-0021's tone: clear, not apologetic). The aim is to make the prototype feel *complete and intentional*, never to fake a working backend.

## Why

- **A dead CTA reads as a bug.** In a portfolio demo, "nothing happens" is indistinguishable from broken. A resolved CTA — even a demo one — reads as deliberate.
- **The pattern already exists.** ADR-0021 proved the demo-dialog approach; extracting it into one component removes duplication and keeps the experience consistent as more CTAs are wired.
- **Legal pages earn their keep.** Turning a placeholder into a real reading layout adds a genuinely missing design-system surface and shows typographic craft, at the cost of some sample prose AI is well-suited to write.
- **Content model stays clean.** Keeping long documents out of the message catalog avoids bloating it and the brittle 3× parity it would force, while still delivering localized content.

## Alternatives considered

- *Disable or hide unbuilt CTAs* — rejected: hiding the core Reserve button (etc.) guts the demo; disabling reads as broken. A demo response is more honest and more complete.
- *Make the legal links simple "coming soon" placeholder pages* — rejected: a real reading layout is more useful to the design system and a better demo than a stub, for little extra cost.
- *Put legal content in `i18n/messages.ts`* — rejected: bloats the flat catalog and forces full 3-locale parity on long prose; a per-locale data module with EN fallback is the right shape.
- *Build real Explore filtering now* — out of scope: that's a genuine feature, tracked separately. A "coming soon" stub keeps the control honest in the meantime.

## Consequences

- New shared `DemoActionDialog` (+ a small hook) under `src/components/`; `BecomeHostPage` refactors onto it.
- New `src/data/legal.ts` (typed per-locale docs + `getLegalDoc` with EN fallback + `isLegalDocId`), `src/pages/LegalPage.tsx`, and a `/legal/:docId` route; unknown ids redirect home.
- New reusable `.sj-prose` reading layout in `src/styles/index.scss`.
- Footer legal links point at the new routes; new `legal.*` chrome keys in all three locales.
- Add/edit-listing CTAs are **explicitly out of scope** here — deferred until a listing editor is specced.
- Real Explore filtering remains a tracked future feature; only the stub affordance lands now.

## Phasing

1. **Legal content pages** (this PR) — ADR + `data/legal.ts` + `LegalPage` + `.sj-prose` + footer wiring + chrome i18n.
2. **Demo CTA affordances** (follow-up PR) — extract `DemoActionDialog`, refactor `BecomeHostPage` onto it, wire Reserve / Accept-Decline / Create-a-community, and the filter stub.

Each step: commit referencing ADR-0023; `docs/progress.md` updated; green-bar gate (`typecheck`/`lint`/`build` + Storybook a11y for new components).
