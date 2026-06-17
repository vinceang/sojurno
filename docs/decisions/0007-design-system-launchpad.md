# ADR-0007 — The design system leaves main nav and becomes a launchpad to Storybook

**Status:** Accepted · **Date:** 2026-06-13

## Context
In the POC, "Design System" is a peer of Explore and Host in the main navigation, and is a bespoke in-app documentation page. That competes with product navigation and duplicates what Storybook already does better.

## Decision
Remove "Design System" from the main nav. Replace the bespoke in-app docs with a thin `/design` launchpad plus a footer link, both pointing to the deployed Storybook, which becomes the canonical design-system documentation.

## Why
- Product nav should be about the product; design-system docs are for builders, not travelers or hosts.
- Storybook is the right home for component docs and a11y audits — maintaining a second hand-rolled docs page is duplicated effort that drifts.
- A small launchpad keeps the system discoverable without cluttering the primary experience.

## Alternatives considered
- *Keep the bespoke in-app docs page* — rejected: duplicates Storybook and drifts out of sync.
- *Remove the design system entry entirely* — rejected: loses a discoverable entry point for reviewers.

## Consequences
- `DesignSystemPage` shrinks to a launchpad.
- Storybook is the single source of design-system documentation.
- Footer carries the persistent link.
