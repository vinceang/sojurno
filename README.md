# Sojurno v2

Fresh production implementation of Sojurno: an affinity-based peer-to-peer stays platform for communities that travel with shared purpose.

This repo uses the original Sojurno ADRs as product/architecture source of truth and the Figma Make redesign as visual direction, not as production code.

## Stack

- Vite + React 18 + TypeScript
- React Router with deep-linkable tenant routes
- Tailwind CSS + SCSS-authored design tokens
- Radix/shadcn-style accessible primitives
- Storybook 8 with a11y addon

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
npm run storybook
npm run build-storybook
```

## Product Shape

- Platform shell: `/`, `/communities`, `/start`, `/design`
- Tenant app: `/t/:tenantId/explore`, `/t/:tenantId/stays/:listingId`, `/t/:tenantId/host`, `/t/:tenantId/host/listings`
- Active tenants: runners and hikers
- Coming-soon tenants: cyclists and climbers
- Gear capability: hikers only
- Listing modes: native booking and host-owned external booking links

Tenant/community content and listing content are authored marketplace content. Shared chrome is wired for EN / ES / FR.
