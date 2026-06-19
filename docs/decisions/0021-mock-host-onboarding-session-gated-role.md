# ADR-0021 — Mock host onboarding & session-gated traveler/host toggle

**Status:** Proposed · **Date:** 2026-06-19

> Revises ADR-0006's role model. ADR-0006 specified a free-standing traveler⇄host toggle available to any visitor ("mock role, no auth"). In practice, building that toggle now has no entry point to gate it — and a session-less free toggle undersells the affinity/trust thesis (ADR-0001), where hosting is a real status, not a costume anyone puts on. This ADR replaces the free toggle with a mock onboarding flow that creates a session, and makes the toggle appear only once that session exists. It also resolves a naming collision discovered during the v2 rebuild: the `role/` directory currently exports the **theme** provider (light/dark), not a role/session abstraction.

## Context

ADR-0006 modeled traveler/host as "a role toggle inside a tenant... mock role, no auth" — anyone could flip into host mode with no gesture beforehand, mirroring Airbnb's toggle in isolation. Two things complicate that as currently specified:

1. **No entry point exists.** Building a toggle with nothing gating it means exposing host-mode UI to every visitor with zero narrative reason to be there. Airbnb's real toggle (confirmed via its own help docs) sits in the profile/account menu and is itself gated by *account state* — hosting is a thing your account has done, not a stance any visitor can take. A context-free toggle is a weaker copy of the real pattern, not a faithful mock of it.
2. **`progress.md` flags a naming collision.** The `role/` directory, meant to hold the traveler/host abstraction, currently holds `ThemeProvider`/`useTheme` (light/dark mode) instead. This needs resolving regardless of how the toggle itself evolves, so a future session doesn't mistake one for the other.

Separately, this is a portfolio piece (ADR-0019 §"portfolio-grade engineering bar"), and a well-crafted onboarding form is stronger demo material than a binary toggle — it's a chance to show real form-design craft (inputs, structure, an honest demo-mode disclosure) rather than skip past it.

## Decision (proposed)

### 1. Resolve the naming collision first, independent of everything else
Rename the directory/module currently misnamed `role/` (theme logic) to something accurate (e.g. `theme/`). This is pure housekeeping and unblocks a clean home for the real session/role logic below. Do this regardless of whether the rest of this ADR is accepted.

### 2. "Become a Host" — a mock onboarding form, not an instant toggle
A new entry point, "Become a Host," appears in the profile/account menu (desktop: profile menu; mobile: inside the hamburger menu, mirroring where Airbnb places its own switch) — but **only when no session exists**.

- The form is a full-looking host application: fields a real onboarding form would have (e.g. name, photo, a sentence about what they host). **Zero validation in v1** — a fully blank submission succeeds. This is a deliberate scope line, not an oversight: the form exists to demonstrate layout/interaction craft, not to gate anything.
- On submit, a **modal appears** stating plainly that this is a demo: no real account is created, the data is local/mock, and continuing will create a simulated host session. Copy is honest, not apologetic — this modal is itself a craft surface (a clean, well-designed dialog), not a regrettable disclaimer bolted on.
- Dismissing/confirming the modal **immediately creates the mock session in host mode** — no separate login step on first run. Whatever the user typed (name, photo if provided) becomes their mock host identity; blank fields fall back to placeholder values. The user lands in the host dashboard already "logged in."

### 3. Session persists; sign-out and re-login are real, demoable states
The mock session is **persisted** (e.g. `localStorage`), not just in-memory — it survives refresh and tab close. This makes "Sign out" and "log back in" honest, demoable states instead of session-theater that resets on reload.

A **separate fake login screen** exists for return visits after sign-out. It does not re-run the onboarding form — it re-authenticates into the *same* persisted mock identity created during onboarding.

### 4. The toggle, once a session exists
Once a host session exists, the profile/account menu (same location as "Become a Host" was) instead shows:
- **Active state → "Switch to traveling"** (if currently in host mode) or **"Switch to hosting"** (if currently in traveler mode) — mirrors Airbnb's own pattern of one contextual link rather than a visible two-state pill.
- **"Sign out"** — clears the persisted session, returns to the anonymous/gated state where "Become a Host" and a (future) "Log in" reappear.

**Until a session exists, no toggle is shown at all** — anonymous visitors are traveler-only, with no host-mode surface to discover or flip into.

### 5. Traveler identity is explicitly out of scope here
This ADR is host-only. A lightweight mock identity for travelers (so e.g. reservation requests have a "from" identity) is acknowledged as a likely future need but is **not specified or built by this ADR** — revisit separately when it becomes load-bearing.

## Why

- **A gated entry point is more honest to the product thesis.** Hosting-as-status (something you become, with a moment of becoming) fits the affinity/trust framing (ADR-0001) better than hosting-as-mode (something anyone toggles into). It also happens to be exactly what Airbnb's actual UI implies, even though Airbnb's underlying account model differs (every Airbnb account *can* host; ours requires the mock onboarding gesture first).
- **The onboarding form is the stronger portfolio artifact.** A binary toggle demonstrates nothing; a well-designed, validated-in-spirit-but-intentionally-unvalidated onboarding form plus an honestly-written demo-mode modal both showcase real craft and document a deliberate scope line (cf. ADR-0005's "seam, not migration" pattern).
- **Persisted sessions make sign-out meaningful.** An in-memory-only session that vanishes on refresh isn't really demoable as a "sign out" feature; persisting it costs little and makes the whole flow real enough to walk a reviewer through.
- **Fixing the naming collision now prevents future confusion.** Cheap, unambiguous, and unblocks a clean home for whatever session/role logic this ADR specifies.

## Alternatives considered

- *Keep ADR-0006's free toggle, build it as originally specified* — rejected: no narrative entry point, undersells the trust thesis, weaker demo than a real onboarding flow.
- *Require minimal validation (e.g. name + email) before allowing submit* — rejected for v1: the point of the form is to demonstrate design, not gate access; zero validation keeps the demo frictionless and is explicitly owner-approved.
- *In-memory-only session (no persistence)* — rejected: makes sign-out/login a fake-feeling reset rather than a real, walkable demo state.
- *Build traveler mock identity in the same pass* — rejected for now: not yet load-bearing; keeping this ADR host-only keeps it a focused, reviewable unit.

## Consequences

- `role/` (or wherever theme logic lives) is renamed away from the misleading name; a new module owns the actual session/role abstraction.
- New mock `HostSession` shape (name, photo?, plus whatever fields the form collects) persisted to `localStorage`; a `useHostSession` (or similarly named) hook reads/writes it.
- New routes/components: the "Become a Host" form, the demo-mode modal, the fake login screen.
- Profile/account menu becomes session-state-aware: anonymous → "Become a Host" / "Log in"; host session active → "Switch to traveling/hosting" / "Sign out."
- Host dashboard and any host-facing avatar/name display pull from the persisted mock identity instead of static placeholder data.
- ADR-0006 is **revised** by this ADR with respect to the role toggle's gating and entry point; its routing/path-resolution decisions (`/t/:tenant/...`, mock role, no real auth) stand unchanged.
- Traveler mock identity remains an explicit, undecided seam for a future ADR.

## Phasing

1. **Housekeeping** — rename the misnamed `role/` directory; confirm nothing else assumed the old name.
2. **Session model** — `HostSession` shape, `localStorage` persistence, the hook that reads/writes/clears it.
3. **Become a Host form** — fields, zero validation, layout/craft pass.
4. **Demo-mode modal** — copy + dialog craft, wired to form submit.
5. **Session creation + host-mode landing** — submit/modal-confirm creates the session and routes into the host dashboard, identity reflected from form input.
6. **Profile/account menu states** — anonymous vs. active-session menu contents, in both desktop and mobile (hamburger) placements.
7. **Fake login screen** — re-authenticates into the existing persisted session; wire "Sign out" to clear it and return to anonymous state.

Each step: commit referencing ADR-0021; `docs/progress.md` updated; hard stop at the boundary.
