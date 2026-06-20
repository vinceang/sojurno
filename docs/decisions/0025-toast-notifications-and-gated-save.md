# ADR-0025 — Toast notifications, login-gated save & in-context login modal

**Status:** Accepted · Implementing · **Date:** 2026-06-20

> Introduces a transient **toast** notification pattern, **gates the Save (heart) action behind login** (revising ADR-0023's frictionless local heart), and adds an **in-context login modal** so the gate doesn't yank the user off the page. Builds on ADR-0024's fixed Test User identity — saves now belong to that signed-in identity, which sets up the Saved view.

## Context

Three threads converged:

1. **Saving had no identity.** ADR-0023 shipped the heart as a frictionless local `localStorage` toggle, open to anyone. With ADR-0024's login + Test User identity in place, and a **Saved view** coming, "saved by whom?" needs an answer. Airbnb's paradigm — and the owner's call — is to **gate save behind login**.
2. **No transient feedback channel.** The app had only modal dialogs (`DemoActionDialog`) and inline text changes. A successful save, a copied link, a "signed in" — these want a lightweight, non-blocking acknowledgement, not a modal.
3. **Login was a full page.** Sending someone to `/login` mid-browse to save a listing loses their place.

## Decision

### 1. Toast notification pattern
A singleton toast system (Radix Toast on the existing substrate, ADR-0019): themed primitive in `lib/Toast.tsx`, an app-level `ToastProvider` + `useToast()` to fire from anywhere.
- **Singleton:** one toast at a time — a new `toast()` replaces the current and resets its timer, so a gallery of hearts never stacks a pile of toasts. (On a single listing there's one heart, so it simply shows.)
- **Transient & honest:** auto-dismisses on a timeout, dismissable (close button + swipe), and **scoped to the firing page** (it captures the pathname and unmounts on navigation) so a toast never outlives its context.
- Tones: `default` / `success` / `info`.

### 2. Save is gated behind login
Clicking the heart while **anonymous** opens the login modal instead of saving. After signing in (as Test User, ADR-0024), the **pending save completes** and a **"Saved" toast** confirms it. Saving while already signed in saves immediately + toasts. **Unsaving is silent** (no toast). Saves are device-local `localStorage` still, but the *action* now requires the Test User session — which is what the Saved view will read. (Revises ADR-0023's "no-friction heart.")

### 3. Login as an in-context modal
The login form is extracted into a shared `LoginForm` used by both the `/login` page and a new `LoginDialog`. The save-gate opens the dialog so the user stays on the listing/gallery. Same empty-only validation and Test User outcome as ADR-0024; on success in the modal, it closes and the pending save resolves (no navigation).

### 4. Toast adoption
- The legal pages' "sample content" disclaimer moves from an inline banner to an **info toast on entry** (less visual weight, same honesty).
- Save success → success toast.
- Reserve / Accept-Decline / Create-a-community **keep their explanatory `DemoActionDialog`s** — they teach what *would* happen; toasts are reserved for lightweight confirmations. This keeps the two patterns distinct rather than redundant.

## Why

- **Gating gives saves an owner** — coherent with ADR-0024 and a prerequisite for a meaningful Saved view; matches the Airbnb paradigm the owner referenced.
- **Toasts fill a real gap** — non-blocking acknowledgement the app lacked; a reusable design-system surface.
- **The modal preserves context** — saving shouldn't cost you your place in a gallery.
- **Singleton + page-scoped** keeps toasts from becoming noise.

## Alternatives considered

- *Keep open save (no gate)* — rejected: muddies the Saved view's ownership; owner chose the Airbnb gate.
- *Gentle nudge toast but still save anonymously* — rejected: leaves saves identity-less.
- *Send to the `/login` page from the gate* — rejected: loses the user's place; the modal keeps context.
- *Toast library (sonner, react-hot-toast)* — rejected: Radix Toast matches the substrate (ADR-0019) and the existing wrapper pattern; no new vendor.
- *Convert Reserve/Accept-Decline to toasts* — rejected: those dialogs explain the demo; toasts are for confirmations.

## Consequences

- New `@radix-ui/react-toast` dep (within ADR-0019's pre-approved Radix set); `lib/Toast.tsx` primitive + Storybook story; `ToastProvider`/`useToast` mounted in the provider tree.
- `useSavedListing` refactors into a context-backed `SavedListingsProvider` (hearts also sync live across the page as a bonus); the toggle gates on `authenticated`.
- New `LoginForm` (shared) + `LoginDialog`; `LoginPage` recomposed onto `LoginForm`.
- Legal disclaimer becomes a toast; save success toasts.
- Unblocks the **Saved view** (next), owned by Test User.

## Phasing

1. **Toast system** (this PR) — `lib/Toast` primitive + `ToastProvider`/`useToast` + Storybook; adopt for the legal disclaimer.
2. **Gated save + login modal** — `SavedListingsProvider` gating, `LoginForm`/`LoginDialog`, save-success toast.
3. **Saved view** (follow-up) — a page listing Test User's saved stays.

Each step: commit referencing ADR-0025; `docs/progress.md` updated; green-bar gate (typecheck/lint/build + Storybook a11y for new components).
