# Sojurno v2 Build Note

Sojurno v2 is a fresh production implementation that uses:

- `../sojurno/docs` as the product and architecture source of truth.
- `../sojurno-redesign/sojurno-redesign` as the visual direction reference only.

The generated Figma Make code is not adopted as application architecture. The visual language is translated into:

- SCSS-authored design tokens.
- Tailwind utility consumption.
- Radix/shadcn-inspired accessible primitives.
- React Router routes.
- Storybook-documented components.

Intentional v2 product deviations approved by the owner:

- EN / ES / FR chrome.
- Unsplash imagery is acceptable for the first production take, with AI-generated static listing assets planned later.
- Tailwind and Radix/shadcn-style primitives are approved dependencies.

## 2026-06-17 redesign implementation capture

This v2 branch is now proving the preferred direction: keep the original Sojurno product thesis and multi-tenant engine concepts, but rebuild the public experience with the `sojurno-redesign` look-and-feel as the visual reference.

High-level changes made so far:

- Adopted the redesign's warm consumer marketplace language: Instrument Serif display type, Plus Jakarta Sans UI type, off-white canvas, near-black primary CTAs, community accent colors, softer cards, and lighter editorial spacing.
- Built the public shell with real routing: platform header, landing page, `/communities`, `/start`, `/about`, `/design`, and tenant-scoped explore/listing/host routes.
- Added a portfolio-oriented About page from the redesign direction: maker profile, discipline cards, builder resources, and design-system links.
- Reworked the footer into the redesign's four-column shell with Product, About, Legal, and active community pills.
- Iterated the landing hero search toward the mockup: location input, community selector, dates affordance, and search CTA. The visual treatment is improved, but the search/date behavior is still intentionally lightweight.
- Replaced the previous generic featured listings area with reusable `CommunityListingRow` sections: community eyebrow, serif row title, `View all`, and four listing cards per active community.
- Added a builder CTA strip below the community rows, matching the redesign structure.
- Added enough mock listing data for each active tenant to support four-card landing rows.

Design-system implications:

- `CommunityListingRow` is now a reusable composition instead of bespoke landing markup.
- The primary CTA contrast issue exposed an important cascade rule: `Button asChild` links can be affected by global anchor styles. Primary button contrast now lives in a post-reset design-system class (`.sj-button-primary`) so links and buttons share the same token-backed behavior.
- Header "Start hosting" and landing builder CTAs now use the same `Button` primitive instead of one-off inline styles.
- More components still need Storybook coverage and documented variants; this pass prioritized product screen fidelity.

Impact on the Sojurno refactor:

- The redesign repo remains a visual/product reference, not an architecture source. We are translating its strongest ideas into the v2 codebase rather than adopting its single-file app structure.
- The engine/tenant line is preserved in spirit: active communities are still data/config-driven, and landing rows resolve tenants/listings without hardcoding UI branches inside shared card components.
- The app is now better positioned as a portfolio piece: the public shell communicates the product thesis, the About page explains the maker/design-engineering angle, and the footer exposes the design system.

Still open:

- We are not done with visual parity. The full-bleed photographic hero, darker community-builder module, richer Explore controls, listing detail gallery, and host dashboard refinements still need follow-up passes.
- The search/date controls need a deliberate product decision: stay lightweight for demo purposes or become real interactive booking/search inputs.
- Button, card, search, row, footer, and About compositions should be documented in Storybook as the design system matures.
- Responsive visual QA still needs a stronger workflow. Playwright is not currently installed in this repo, so browser screenshot checks have been manual/user-assisted.
