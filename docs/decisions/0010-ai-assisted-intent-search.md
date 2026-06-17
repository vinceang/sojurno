# ADR-0010 — AI-assisted intent search as an affinity-native capability

**Status:** Proposed · **Date:** 2026-06-13

> Captured from a working-session question: in an AI-assisted world (e.g. Google's AI Overviews), should the *flow itself* change, not just gain a feature? The conclusion was to commit to the idea but defer the build — surfacing it in v1 only as a designed, dormant entry point.

## Context
Conventional marketplace UX is filter-driven. AI-assisted interfaces raise a real question for this product specifically — not a trend-chasing one — because **affinity is latent context, and natural language is the medium that context lives in.** A generic stays search can't assume much about the user. But "I'm a runner doing the Berlin Marathon in September — find a host near the course who gets race-morning logistics" is a sentence one runner would actually say to another, and the platform's whole thesis is that host and guest are the same kind of person. Intent search exploits exactly the context the platform already holds (tenant + event + profile).

Three counter-pressures keep this out of v1:
- **The hard UX problem is trust, not input.** Two-sided marketplaces live or die on reassurance between strangers — verified identity, reviews, a real face, a specific message. AI doesn't solve that; polishing search while the trust layer is thin solves the *easy* part and skips the hard one.
- **A half-built conversational flow reads as less senior** than a beautifully executed conventional one. For a portfolio piece, disciplined restraint signals stronger judgment than an ambitious, 70%-landed rebuild.
- **Résumé-driven AI adoption is a trap** — the feature must exist because the flow is genuinely improved, not because the moment calls for "AI."

## Decision (proposed)
Defer AI-assisted intent search to a future version. Model it as a **capability module** on the same axis as gear (→ ADR-0003) and events (→ ADR-0009). In v1, surface it only as a **designed, dormant entry point** — an "AI search · coming soon" affordance — with the conventional filtered flow remaining the backbone.

The v1 craft bar: the placeholder must **look designed, not parked**. A styled intent-search bar with a subtle "coming soon" treatment reads as a roadmap; a greyed-out button with a tooltip reads as a stub. Same idea, opposite impression.

## Why (proposed)
- Natural-language intent is affinity-native here — a defensible product reason, not a gimmick.
- A dormant-but-designed CTA does real work before the feature exists: it signals product *direction* and deliberate sequencing to a reviewer.
- A single, sharp, real AI seam beats a vague ambitious one for portfolio signal.

## Alternatives considered
- *Conversational-first rebuild of the whole flow* — rejected: hard to finish well; a half-built version undercuts the senior signal; bets the entire UX on an unproven pattern.
- *No AI surface in v1 at all* — rejected: misses a cheap, honest signal of direction.
- *AI assist on the host side instead of search* — noted, not chosen: the host half is the lonelier, more neglected side of most marketplace UX and may be the stronger seam. Worth pressure-testing when this ADR is promoted.

## Consequences (if promoted)
- A new capability flag (e.g. `aiSearch`) on tenant config.
- Intent interpretation draws on tenant + event + profile context, returning something distinct from the filtered grid.
- Depends on the affinity/trust layer (profiles, verification) being real first — that is the prerequisite work, not this.
- Revisit after the two-tenant + gear proof lands and the trust layer is fleshed out.
