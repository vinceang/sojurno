# ADR-0024 — Mock credentialed login & the fixed "Test User" identity

**Status:** Accepted · Implemented · **Date:** 2026-06-20

> Revises ADR-0021's login semantics. ADR-0021 shipped mock host onboarding plus a stub `/login` that merely re-entered the identity created during onboarding ("no password required"). This ADR replaces that stub with a real-looking credentialed login form — demonstrating a validation scheme — and establishes a single canonical authenticated identity, **Test User**, that the future add/edit-listing facility will attribute listings to.

## Context

The prototype has no real auth or backend (persistence stays parked — ADR-0017). ADR-0021 built onboarding as a craft demo and a minimal login that re-authenticated the persisted onboarding identity. Two gaps motivated revisiting it:

1. **No real login surface.** A portfolio piece benefits from a conventional login form (username, password, forgot-password, create-account) and, more importantly, a chance to show a **validation scheme** — something ADR-0021 deliberately omitted from onboarding ("zero validation by design"). The two forms now make a complementary pair: one shows layout craft without validation, the other shows validation patterns.
2. **No single identity for listing management.** An upcoming facility to add/edit listings needs a stable owner. Re-entering whatever name was typed during onboarding makes attribution ambiguous. A fixed identity keeps it simple and predictable.

## Decision

### 1. A real-looking login form
`/login` is a credentialed form: **username, password, "Forgot password?", "Create an account."**

### 2. Validation = empty-field rejection only
Any **non-empty** username and password pass. Submitting with an empty field shows an inline error on that field and blocks submit. This is the whole validation scheme — deliberately minimal, enough to demonstrate the pattern (inline errors, `aria-invalid`, blocked submit) without gating a demo.

### 3. Login always signs in as the fixed "Test User" identity
A valid submit signs in as `Test User` (`{ name: 'Test User' }`) **regardless of the credentials typed or any prior onboarding identity**. The session lands authenticated in traveling mode (host mode is one toggle away). This **overrides ADR-0021 §3** (login no longer restores the onboarded identity).

### 4. Forgot password & Create an account resolve (→ ADR-0023)
"Forgot password?" opens a demo affordance (`DemoActionDialog`) stating no email is sent. "Create an account" links to the existing `/become-a-host` onboarding. No dead ends.

### 5. Signed-in behavior
When a session is already active, `/login` shows a "signed in as Test User" note instead of the form — **no login button**. The onboarding **"Your name"** field **prepopulates** with the active account name (Test User), so the identity is reflected wherever a name field appears.

### 6. Future listing attribution
When the add/edit-listing facility lands, listings are created under the signed-in identity — i.e. **Test User**. (Facility itself is out of scope here.)

## Why

- **The login form is the stronger portfolio artifact** and the natural home for a validation scheme, complementing onboarding's intentionally-unvalidated craft demo.
- **A single fixed identity simplifies what's next** — the listing editor and the Saved view both want a stable owner without real auth.
- **Honest over theater.** "Use any username and password" is stated plainly; nothing pretends to authenticate.

## Alternatives considered

- *Keep ADR-0021's re-entry login (restore onboarded identity)* — rejected: ambiguous owner for listings; weaker demo than a real form.
- *Real validation (credential checks, formats)* — rejected: no backend to validate against; empty-only keeps the demo frictionless while still showing the pattern.
- *Collapse onboarding to Test User too (one identity everywhere)* — not taken: onboarding stays a distinct craft flow (ADR-0021); login is the canonical Test User path, and onboarding's name field simply prefills from the active identity when signed in.

## Consequences

- `SessionProvider.login()` now sets `{ account: TEST_USER, authenticated: true, mode: 'traveling' }`; `TEST_USER` constant added to `session-context.ts`.
- `LoginPage` rewritten: credentialed form + empty-only validation + signed-in state; `BecomeHostPage` name field prefills from the active account.
- i18n: new `login.*` keys (username/password/forgot/createAccount/errors/forgot-demo/signed-in) in EN/ES/FR; the obsolete `login.becomeHost` key removed.
- ADR-0021 §3 (login re-entry) is **revised**; its onboarding/session-persistence decisions stand.
- Unblocks the **Saved view** (next) and the future add/edit-listing facility, both owned by Test User.
