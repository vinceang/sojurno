# ADR-0006 — Navigation, routing, and tenant resolution

**Status:** Accepted · **Date:** 2026-06-13

## Context
Three changes converge on the same structural problem: the design system leaves the main nav (ADR-0007), travelers and hosts get distinct areas, and the platform is multi-tenant (ADR-0001). The current app hand-rolls routing with a `useState` route and a single shared header — which stops paying for itself the moment areas and tenants multiply.

## Decision
- **React Router** with real, deep-linkable URLs.
- **Path-based tenant resolution**: `/t/:tenant/...` (e.g. `/t/runners/explore`), with a tenant context provider resolving config from the path.
- **In-app tenant switcher** for the demo — one-click flip between communities.
- **Traveler/host as a role toggle inside each tenant** — the Airbnb "switch to hosting ⇄ traveling" pattern, swapping nav and view set.
- **Mock role, no auth** for v1.

## Why
- "Separate areas" without deep-linkable URLs reads as half-done to a reviewer.
- Path-based resolution is a legitimate production mechanism *and* trivially demoable.
- The role toggle composes cleanly — every community has its travelers and hosts.
- Mock role keeps v1 scoped; auth is a known later seam.

## Alternatives considered
- *Keep hand-rolled `useState` routing* — rejected: doesn't scale to areas × tenants.
- *Subdomain tenancy (`runners.host`)* — rejected: infra-heavy for a demo, not locally clone-and-run.
- *A separate host application* — rejected: duplication, hides the one-engine story.

## Consequences
- React Router becomes a dependency; route shape is defined up front.
- A `TenantProvider` reads the path; a role toggle swaps nav and views within a tenant.
- Auth/identity is an explicit v2 seam.
