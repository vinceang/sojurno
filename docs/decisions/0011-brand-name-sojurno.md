# ADR-0011 — Brand name: Sojurno

**Status:** Accepted · **Date:** 2026-06-14

## Context
The project's working title was *Sojourn*. On moving toward a real brand and securing a domain, `sojourn.com` (and every close variant) was unavailable — unsurprising, since "sojourn" is a common dictionary word. `sojurno.com` was available and was secured.

## Decision
Name the platform **Sojurno**. Rename across code, tokens, wordmark, i18n strings, package metadata, and docs. The working title "Sojourn" is retained only as historical reference (here and in ADR-0001).

## Why
- **Ownable vs. unclaimable.** "Sojourn" is a dictionary word — un-trademarkable in the abstract, impossible to rank for, every domain variant taken. "Sojurno" is a coined word: distinctive, searchable, brandable.
- **Exact-match .com secured.** The brand and its primary address agree — worth a great deal for a consumer marketplace.
- **Reads as a name, not a noun.** One unambiguous pronunciation; the trailing *-o* gives a warm, Romance-language lilt that suits a platform about staying in someone's home abroad, and sits in the coined-startup-name family (Strava, Komoot, Klarna).
- **Cheaper now than later.** Renaming while the codebase is small and pre-restructure is far less costly than after the platform work lands.

## Alternatives considered
- *Keep "Sojourn" as the spoken name, use sojurno.com only as the address* — rejected: a portfolio piece is stronger when name, domain, and code all agree.
- *Choose a different available word entirely* — rejected: Sojurno preserves the meaning and feel already designed around, with no real downside.

## Consequences
- A one-pass rename (`Sojourn → Sojurno`) across the repo, committed on its own for a clean, legible diff.
- "Sojourn" survives only as the documented prior working title.
- Brand tokens, wordmark, and copy now read Sojurno throughout.
