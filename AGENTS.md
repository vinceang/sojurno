# AGENTS.md — Sojurno

Governance for AI agents (Claude Code et al.) working in this repo. Read this in full before any task. It is binding.

---

## 1. What Sojurno is

An affinity-based, multi-tenant, peer-to-peer stays platform: communities of shared interest where host and guest belong to the same group. One tenant-agnostic **engine**; many communities expressed as **config**. v1 ships two contrasting tenants — **runners** and **hikers**.

**This repo (`sojurno-v2`) is the trunk** (→ ADR-0019). It is a **fresh production rebuild** that keeps the original Sojurno *architecture* (engine/tenant separation, five-axis tenant config, i18n, routing, capability gating — re-implemented from the ADRs) and adopts the `sojurno-redesign` *visual language* on a **shadcn/Radix + Tailwind v4** substrate. The original `sojurno` repo is archive/reference; `sojurno-redesign` is a visual reference only. Preserve the engine/tenant line, the token-driven cascade (light/dark + per-tenant accent), and the multilingual chrome (EN/ES/FR).

## 2. Source of truth — required reading

Before writing code, read in this order and treat as authoritative:

1. `docs/architecture.md` — the *what/how*. Start here.
2. `docs/decisions/*.md` — the *why*. Each is an ADR.
3. `docs/progress.md` — the *where-are-we*: current phase, phase status, and open TODOs/seams. Check it to learn what's done and what's next.

When code and these docs disagree, the docs win. When a task would contradict an **Accepted** ADR, **stop and surface the conflict** — do not silently override.

### ADR scope (check status before acting)

- **Accepted → in scope for v1:** 0002 (tenant = 5-axis config), 0003 (gear = inventory), 0004 (capabilities as modules), 0005 (gear included/flagged, not reserved), 0006 (routing + tenant resolution + traveler/host), 0007 (design-system launchpad), 0014 (brand axis = logo + color + typography, bounded to token slots — *visual values superseded by ADR-0019, governance principle stands*), 0015 (platform shell vs tenant app; `/` landing + community gallery, `/communities`, `/start` informational; listings tagged by tenant), 0016 (marketplace content single-language while chrome stays bilingual; AI-generated imagery the end state — *v2 uses Unsplash as an owner-approved interim per ADR-0019*), **0019 (v2 as trunk; shadcn/Radix + Tailwind v4 substrate fed by tokens via `@theme inline`; interim SCSS tokens with DTCG → Style Dictionary pipeline scheduled; EN/ES/FR; Figma Code Connect + CI as goals)**. 0001 (thesis) and 0008 (docs strategy) are context/meta. 0011 (brand: Sojurno) is done.
- **Proposed / Rejected → NOT v1 scope, do not build:** 0009 (events), 0010 (AI intent search), and any later Proposed/Rejected ADR (e.g. iCal sync, external-listing ingestion). Leave a seam **only** where an Accepted ADR specifies one (e.g. the unused `GearItem.fee` field per ADR-0005).

## 3. Prime directive — the engine/tenant line

Everything hinges on one separation (→ ADR-0002):

- **Engine** (tenant-agnostic, shared): domain (listing/booking/reservation), component library, page scaffolds, routing, i18n machinery, primitive tokens. **Engine code must never reference a tenant by name or branch on tenant identity.**
- **Tenant** (config the engine reads): brand (semantic tokens), vocabulary (i18n + affinity language), taxonomy (filters/amenities), trust signals, capabilities (optional modules).

If a feature needs to know a tenant's *name*, it is in the wrong layer. Differences between communities are expressed as **config and capability flags**, never as hardcoded conditionals in engine code.

## 4. How to work — phased, with hard stops

Execute in phases. **Stop at each phase boundary for human review. Do not begin the next phase without an explicit go.** Commit at each boundary with a clear message that references the relevant ADR(s). **Keep `docs/progress.md` current**: update the phase status and the open-TODO list at every boundary, and whenever a TODO opens or closes.

1. **Routing spine** — introduce React Router with real, deep-linkable URLs; replace the hand-rolled `useState` routing in `App.tsx`. Routes per `architecture.md`. (→ ADR-0006)
2. **Tenant config layer + platform shell** — split into two reviewable units (→ ADR-0002, ADR-0014, ADR-0015):
   - **2a — tenant config + branded app:** the five-axis tenant config as a typed artifact; a `TenantProvider` resolving tenant from the path (`/t/:tenant/...`); `data-tenant` composing with `data-theme`; the token build loops over tenant configs; per-tenant color + logo live (typography shared seam); listings tagged by tenant; in-app tenant switcher. Define **runners** and **hikers** as config.
   - **2b — platform shell:** the Sojurno-branded front door above the tenants — `/` landing (hero + community-categorized gallery), `/communities` directory, `/start` (informational only). Two header contexts; reservations stay in the tenant flow.
3. **Traveler/host split** — role toggle inside a tenant (the "switch to hosting ⇄ traveling" pattern); mock role, no auth. (→ ADR-0006)
4. **Gear module** — `GearItem` as a typed inventory object; gear capability **on** for hikers, **off** for runners; included/free with an unused `fee` seam; booking **flags** selected gear onto the reservation (no quantity locking); surfaced on listing, booking, and host dashboard. (→ ADR-0003/0004/0005)
5. **Design-system launchpad** — remove "Design System" from main nav; shrink to a thin `/design` launchpad linking to Storybook; persistent footer link. (→ ADR-0007)

Each phase is done when: it builds (`npm run build`), typechecks clean, Storybook stories for any new/changed components pass the a11y audit, and the engine/tenant line is intact.

## 5. Hard rules

- **Do not invent product scope.** If a behavior isn't in an Accepted ADR or `architecture.md`, ask before building it.
- **Decisions are documented, not buried.** If a change embodies a new decision, propose an ADR (Status: Proposed) rather than deciding silently in code.
- **Tokens are the only source of color, spacing, and radius.** No hardcoded colors/hex/spacing in components — consume them through Tailwind utilities that resolve to our CSS variables (the `@theme inline` bridge), never raw hex. Theme and tenant change via root attributes only (`data-theme` / `data-tenant`) — never per-component conditionals. *Interim:* tokens are hand-authored in `src/styles/_tokens.scss`; once the DTCG → Style Dictionary pipeline is reinstated (ADR-0019 Phase A), `_tokens.scss` becomes generated output and is edited only via the JSON source.
- **i18n contract holds — for chrome.** Every user-facing **chrome** string routes through `t()`. `es` is typed against `en`; a missing key must remain a compile error. No hardcoded copy, no English fallback strings inline. **Marketplace content** (listing name/description/host/loc, image alt, review text) is **single-language** and exempt from this contract (→ ADR-0016); amenity labels and tenant vocabulary remain chrome and stay bilingual.
- **Components stay pure and prop-driven.** No app-state imports in `src/lib/`. Co-locate a `*.stories.tsx` with every library component.
- **Accessibility is a floor, not a follow-up.** Preserve the skip link, landmarks, labelled controls, focus management, and `prefers-reduced-motion`. Stories run `a11y: { test: 'error' }`.
- **Strict TypeScript stays strict.** `noUnusedLocals` / `noUnusedParameters` stay on. No `any` without an inline justification comment.
- **No new runtime dependencies without flagging first.** Pre-approved by ADR-0019: React Router, Tailwind v4 (`@tailwindcss/vite`), Radix primitives, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`. Anything beyond these: stop and ask.
- **Generated artifacts are not edited or committed by hand** *(applies once the pipeline is reinstated).* Today `src/styles/_tokens.scss` is hand-authored (interim); after ADR-0019 Phase A it becomes Style Dictionary output built from DTCG JSON — at that point edit the JSON, not the generated SCSS/CSS.

## 6. Tech context (so you don't re-derive it)

- **Stack:** Vite 5 + React 18 + TypeScript (strict). **Tailwind v4 + Radix primitives + `class-variance-authority`** (shadcn-style) for the component substrate; no CSS-in-JS. Styling resolves through Tailwind utilities backed by CSS variables (`src/styles/tailwind.css` `@theme inline` over `src/styles/_tokens.scss`).
- **Tokens:** *interim* hand-authored SCSS (`src/styles/_tokens.scss`), attribute-scoped (`:root` / `[data-theme="dark"]` / `[data-tenant="X"]`) and consumed via `@theme inline`. The **DTCG JSON → Style Dictionary** pipeline is scheduled for reinstatement (ADR-0019 Phase A) to make this generated output and emit Figma-compatible variables. Flipping an attribute re-resolves everything with no re-render.
- **i18n:** EN / ES / FR (`src/i18n/`); chrome routes through `t()`, marketplace content single-language (→ ADR-0016).
- **Imagery:** v2 renders real `<img>` from `Listing.images` — **Unsplash** sources as an owner-approved **interim** (→ ADR-0019). End state is **AI-generated static assets** produced offline, no runtime AI, no scraped images (→ ADR-0016). There is **no `Scene` fallback** in v2 (the original's generative scene was not carried over).
- **Storybook:** 8.x react-vite with the a11y addon (`.storybook/`). **ESLint** is wired (`npm run lint`). **GitHub Actions CI** is a goal, not yet present (→ ADR-0019).

## 7. Conventions

- One phase per reviewed unit of work; commit at boundaries; reference ADRs in messages (e.g. `feat(routing): React Router spine (ADR-0006)`).
- New tenants are **data**, documented as config with a short header comment — never per-tenant prose docs (→ ADR-0008).
- Keep `architecture.md` current when structure changes; keep rationale in ADRs, not inline narration.

## 8. Out of scope for v1 (explicit seams, do not build)

Gear **pricing** and **quantity reservation** (→ ADR-0005); **auth / real identity** behind the mock role (→ ADR-0006); **events** (→ ADR-0009); **AI intent search** (→ ADR-0010, surface only as a designed, dormant "coming soon" entry point if/when instructed); **iCal availability sync** and **external-listing ingestion** (forthcoming ADRs). Build the seam only where an Accepted ADR names one.

## 9. First actions for a new session

Read `docs/architecture.md` and the Accepted ADRs. Confirm the current phase and open TODOs from `docs/progress.md` (fall back to git log / ask if it's stale). Before writing code for a phase, restate the plan and the affected files for review. Then proceed — and stop at the boundary, updating `docs/progress.md`.
