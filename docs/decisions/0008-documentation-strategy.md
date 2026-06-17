# ADR-0008 — Documentation strategy: ADRs for *why*, architecture.md for *what*, tenants as config

**Status:** Accepted · **Date:** 2026-06-13

## Context
The documentation must do two jobs: inform the build (read by Claude Code in the VS Code workspace) and serve as raw material for a design-portfolio case study. A build spec is imperative and terse; a case study is narrative and tension-driven. One file trying to be both reads as a spec with apologetic asides, or a story cluttered with implementation detail.

## Decision
- Capture the **why** as per-decision **ADRs** in `docs/decisions/NNNN-*.md`, written in plain narrative (context → decision → why → alternatives → consequences) — a shape that is already ~80% a case study.
- Capture the **what/how** in a single living `docs/architecture.md` that points back to ADRs for rationale so it doesn't bloat.
- Document **tenants as config** (a typed object with a short header comment), not as per-tenant prose — because the reasoning is cross-tenant and per-tenant prose would just restate the engine.
- **Synthesize the polished case study after the build exists**, when before/after visuals and a tenant-switch screen recording are available.

## Why
- ADR shape ≈ case-study shape; writing them now banks portfolio beats while the reasoning is fresh.
- Separate files per decision are individually citable and produce clean diffs.
- Tenants differ in data, not reasoning; their "why" is the platform ADRs.
- A design case study is carried by visuals that don't exist yet.

## Alternatives considered
- *Single rolling `DECISIONS.md`* — rejected: less citable, noisier diffs.
- *A "why" doc per tenant* — rejected: restates the engine.
- *Write the case study now* — rejected: needs visuals and a recording.

## Consequences
- `docs/decisions/*.md` accumulate as we lock decisions.
- `docs/architecture.md` is the entry point for the build.
- Tenant configs carry short header comments; no per-tenant prose docs.
- Case study assembled post-build.
