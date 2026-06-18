# Sojurno Design System — component spec & Figma mapping

> The living reference for the component layer. Pairs with the token pipeline (→ ADR-0019) and is the source of truth for the **Phase C** Figma library + Code Connect round-trip. Component and variant names defined here become the **Figma component/variant names** — change them here first, deliberately.

## 1. How the system is layered

Three layers, kept distinct on purpose:

| Layer | Lives in | Figma equivalent |
| --- | --- | --- |
| **Tokens** — color, radius, type, shadow, space | `tokens/*.json` → CSS variables, scoped by `[data-theme]` / `[data-tenant]` | **Variables**, with **modes** (light/dark × tenant) |
| **Components** — the semantic vocabulary (Button, Card, ListingCard…) | `src/lib` (primitives) + `src/components` (composites) | **Components** with **variant properties** |
| **Utilities** — Tailwind classes | inside component files only | (never surfaced — implementation detail) |

**The rule that makes this designer- and developer-friendly:** the semantic layer is the **component API**, not a CSS class. `<Card padding="lg" elevation="lg">` is this system's `.card.card--lg`. Pages **compose named components**; raw utility classes are allowed only inside a component or for a genuine one-off. Repeated utility clusters in page markup are debt — they should become a component or a variant.

Why this serves Code Connect: Figma thinks in components + variants + variables, which map almost 1:1 onto cva-variants + CSS-variable tokens. Code Connect surfaces a component's **prop API** for the selected variant (`<Card elevation="lg" />`) and never shows the utility classes. So the variant names below are the contract between design and code.

## 2. Naming conventions (these become Figma variant property names)

- Variant **property** names are lowercase nouns: `variant`, `size`, `tone`, `padding`, `elevation`, `kind`.
- Variant **values** are lowercase, semantic not literal: `primary` / `accent` / `secondary` / `ghost` (not `dark`/`orange`); `sm` / `md` / `lg`; `event` / `place`.
- Boolean-ish states are real props: `disabled`, `asChild`, `selected` — surfaced as Figma boolean variants where they change appearance.
- One component = one Figma component with variant properties; do **not** split into `CardSmall`/`CardLarge`.

## 3. Primitive inventory (`src/lib`) — canonical APIs

Already variant-driven (cva), ready to map:

| Component | Variant props (→ Figma variants) | Notes |
| --- | --- | --- |
| `Button` | `variant` primary·accent·secondary·ghost · `size` sm·md·lg·icon | `asChild` for link composition |
| `Badge` | `tone` neutral·accent·outline | the canonical chip |
| `Avatar` | `size` sm·md·lg | image + initials fallback |
| `Card` | `padding` none·md·lg · `elevation` none·sm·lg | `asChild` to render as `article`/`aside` |

Radix-backed wrappers (variants come from state, mapped as Figma states): `DropdownMenu`, `Tabs`, `Checkbox`, `Dialog`, `Switch`, `Tooltip`, `Select`, `Calendar`. Bespoke: `Rating`, `Stepper`, `Separator`, `Input`.

## 4. Extraction candidates (the audit) — add before Figma

The recon found these repeats; each becomes a component so the vocabulary is complete and the Figma library is clean:

1. **`Eyebrow`** *(14 usages)* — the uppercase tracked kicker over headings. Props: `tone` muted·accent. Replaces hand-rolled `text-xs font-extrabold uppercase tracking-[0.2em]`.
2. **`SectionHeader`** *(10 pages)* — eyebrow + serif title + optional subtitle, with consistent rhythm. Props: `align` start·center. Composes `Eyebrow`.
3. **`MediaTile`** *(4 usages)* — the image-fills-the-box + bottom-gradient "poster" base shared by `CollectionCard`, `CommunityCard`, the landing CTA, and the listing hero. Props: `ratio` (e.g. `2/1`, `4/3`, `21/9`), `overlay` scrim·none. The community/collection cards then compose it instead of re-rolling the gradient.
4. **Chip review** — fold the ~4 stray `rounded-full … text-xs` clusters into `Badge` (`tone="neutral"`); retire `CommunityPill`'s bespoke styling onto `Badge` where it's just a tinted chip.
5. **Card adoption** — the 14 inline `rounded-* border bg-card` surfaces should use `<Card>` (with `asChild` where semantic tags matter), so "change all cards" is one file.

Composite components stay as-is but get **documented variant APIs**: `ListingCard` (`variant` full·compact), `ListingRow`, `CollectionCard` (`kind` event·place), `CommunityCard` / `UpcomingCommunityCard` (consider merging into one `CommunityCard` with `status` active·upcoming).

## 5. Figma mapping (Phase C target)

1. **Variables first** — generate Figma variables from the token CSS: `color/*`, `radius/*`, `font/*`, with **modes** = light / dark and a collection of tenant accent modes. (This is also why the DTCG → Style Dictionary pipeline matters — it can emit a Figma-variable export.)
2. **Primitives as components** — each §3/§4 component becomes one Figma component; its cva variant props become Figma **variant properties**; its colors/radii bind to the variables (not hardcoded).
3. **Composites** — built from the primitives, mirroring the code composition.
4. **Code Connect** — a `.figma.tsx` per component maps Figma variant → code props, so selecting a variant in Figma shows the real `<Component … />` snippet.

## 6. Phase C sequence

- **C0 — Spec + conventions** (this doc). ✅ when names are confirmed.
- **C1 — Extractions** — add `Eyebrow`, `SectionHeader`, `MediaTile`; refactor pages onto them + `Card` + `Badge`; merge `CommunityCard` status variant. Storybook story per new component. *This is the "nail down componentization" step — done before any Figma work.*
- **C2 — Storybook coverage** — every primitive + key composite has stories covering all variants/states (the visual source for the Figma library).
- **C3 — Figma library** — generate variables (with modes) + components with variants from the codebase (`figma-generate-library`).
- **C4 — Code Connect** — wire `.figma.tsx` mappings (`figma-code-connect`); the round-trip is live.

Each step: commit referencing this doc + ADR-0019; `progress.md` updated; hard stop at the boundary.
