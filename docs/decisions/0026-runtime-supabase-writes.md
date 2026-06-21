# ADR-0026 — Activate the runtime Supabase backend (live listing writes + auth + hybrid reads)

**Status:** Accepted · Implementing · **Date:** 2026-06-20

> Turns on the **runtime backend** that ADR-0017/0022 deliberately parked. The deployed app now **authenticates** (a real Supabase Auth session behind the existing login UX), **writes** listings + **uploads** images to Supabase, and **reads** user-created listings live — merged with the curated build-time export. This is the foundation for the add/edit-listing facility.

## Context

The owner wants to create/edit/delete listings in the running app with self-uploaded images, persisted for real — not a localStorage simulation. ADR-0022 shipped the DB + offline generator + build-time export and explicitly left runtime reads/writes as "the preserved one-file flip." That flip is now wanted.

The blocker was identity: the app's "Test User" (ADR-0024) was a mock localStorage flag, so RLS had nothing to key on. Resolved by making Test User a **real, single, shared Supabase Auth account**.

## Decision

### 1. Auth — one shared real "Test User" account
- A single Supabase Auth user is seeded (the "Test User"). The existing login form signs into it with **fixed demo credentials shipped in the client** (`VITE_DEMO_EMAIL`/`VITE_DEMO_PASSWORD`) — preserving ADR-0024's "any input → always Test User," now backed by a real session. Shared deliberately so a portfolio viewer can try the host flow.
- `SessionProvider` derives `authenticated` from the Supabase session (`getSession` + `onAuthStateChange`); `signOut` ends it. `mode` (traveling/hosting) stays local. Identity is always Test User.
- **Graceful fallback:** with no `VITE_` env (local dev), it reverts to the prior mock-only flag so the app still runs.

### 2. Security — RLS, owner-scoped
- New `listings.owner_id` (FK `auth.users`, nullable). The curated 29 keep it null.
- Public SELECT of `status='published'` stays. Writes require `authenticated` and are owner-scoped: INSERT must set `owner_id = auth.uid()` and `source='user'`; UPDATE/DELETE only where `owner_id = auth.uid()`. So the 29 are protected and anon visitors are read-only.
- Storage `listing-images` (public-read) gains an authenticated-insert policy (+ owner delete).
- The anon/publishable key and demo creds are the *only* secrets in the client bundle — both safe by design (RLS limits blast radius). The service-role key stays scripts-only.

### 3. Reads — hybrid, resilient
- The curated seed/generated listings remain the **build-time export** (`listings.generated.ts`) — synchronous first paint, and they still render if the free-tier DB pauses.
- **User-created listings** (`source='user'`) are fetched live at runtime and merged via a `useListings()` hook. `export-listings` excludes `source='user'` so live rows never bake into the static export.
- Worst case (DB asleep/unreachable): the 29 still render; the live overlay is simply empty until it wakes.

## Why

- A real auth account is the smallest change that makes ownership/security real — far less than full user registration, which solves a multi-user problem the project doesn't have. The 29 hosts stay display content, not accounts.
- Shared demo creds fit a portfolio: viewers can try add/edit; RLS + re-seeding bound the risk.
- Hybrid reads keep the site fast and resilient (free-tier pause, offline) while still delivering live, immersive, editable listings.

## Alternatives considered

- *Full user registration + migrate the 29 hosts to auth users* — rejected: most work/maintenance, reworks ADR-0021/0024, for users not expected.
- *Per-visitor anonymous auth* — rejected: fragments ownership per browser; not the single "all under Test User" pool the owner wants.
- *Open anon writes (no auth)* — rejected: a public site with anonymous insert/delete; worse security than a gated shared account.
- *Full runtime reads (drop the export)* — rejected: the whole catalog would vanish on a free-tier pause; bigger async refactor.

## Consequences

- `@supabase/supabase-js` moves devDeps → deps (now a runtime client). New `src/lib/supabase.ts` (null when unconfigured). New `VITE_` env (committed to `.env.example`; owner adds real values to `.env` + Vercel).
- `SessionProvider`/`session-context` become a real-auth bridge (login/onboarding async).
- New migration adds `owner_id` + write RLS + Storage upload policy (owner-applied).
- Phase 2 adds `UserListingsProvider`/`useListings` + refactors the listing-data consumers to merge live rows. Phase 3 adds the add/edit/delete UI + image upload.
- **Owner prerequisites:** seed the Test User auth account; add `VITE_` env; apply the migration.

## Phasing

1. **Backend + real auth** (this PR) — client, migration, `SessionProvider` → Supabase, env, ADR.
2. **Read overlay** — `useListings()` merge; `export-listings` source filter.
3. **Add/Edit/Delete UI** — `ListingFormPage`, host management, image upload, validation, toasts, i18n.

Each step: commit referencing ADR-0026; `docs/progress.md` updated; green-bar gate.
