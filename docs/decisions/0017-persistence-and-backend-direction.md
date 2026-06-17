# ADR-0017 — Persistence & backend direction (Supabase + serverless, tenant-isolated)

**Status:** Proposed · **Date:** 2026-06-15

> A **parked** direction, recorded so the decision is coherent and not re-litigated. **Not built in v1.** The phased frontend roadmap (Phases 2b–5) proceeds on static/mock data; this is promoted only when persistence, auth, or an admin surface is actually needed.

## Context
v1 is a static SPA: listing data is seed code, the role is mocked, bookings are throwaway (ADR-0006). That is the right scope for the demo. But several real needs sit just beyond it: **persistence** (favorites/bookings survive), **auth/identity** (the seam ADR-0006 flagged), an **admin surface** for listings, a **home for generated listing images**, and later **iCal sync** (ADR-0012). We want the backend direction settled so the data model and seams stay consistent — without building infra now and stalling the roadmap.

## Decision (proposed)
- **Managed Postgres via Supabase + Vercel serverless functions**, behind a **thin API contract** so the runtime can later move (functions → a dedicated Node service) without the frontend caring.
- **Multi-tenancy at the data layer:** one shared database with a `tenant_id` column and **Postgres row-level security (RLS)** — the engine/tenant line (ADR-0002) enforced in data, "isolation, not just themed UI."
- **Frontend data-access seam:** route all reads through one module so swapping static seed → `fetch('/api/…')` is a one-file change. This is the **only** part worth doing during v1, and it can ride along with a phase rather than be its own detour.
- **Auth:** Supabase Auth; an **admin role first** (gates listing writes), with guest/host auth later behind the mock role (ADR-0006).
- **Storage:** Supabase Storage for the AI-generated listing images (ADR-0016).
- **Listing generator = offline preloader.** A separate batch script generates listings and **bulk-inserts** them (service role) to seed the database. It is not a runtime feature and not wired into the app; the public app never calls AI (consistent with ADR-0010).
- **Admin UI:** optional and later — Supabase Studio covers manual edits day one; a gated `/admin` route can come if needed.

### Illustrative schema (sketch, not DDL)
```
tenants      (id slug, name)                          ← isolation anchor / FK target
users        (Supabase auth.users)                    ← identity
memberships  (user_id, tenant_id, role)               ← traveler | host | admin, per community
listings     (id, tenant_id FK, …canonical Listing,   ← amenities text[], images jsonb,
              status: draft | published, created_at)      status drives generator/admin
bookings     (id, listing_id, tenant_id, guest, …)    ← when persistence lands
```
RLS: public reads see `status='published'` scoped to the community; writes gated to `host`/`admin` membership of that `tenant`; the generator runs as service role.

## Why
- **Lightweight to start, scales like Postgres** (vertical, read replicas, pooling via Supavisor) — far beyond what a demo or early venture needs.
- **No lock-in:** Supabase is open-source and *just Postgres* — exit to RDS/Neon/self-hosted with standard tooling. A door, not a cage.
- **RLS fits the thesis:** tenant isolation is a native Postgres feature, scaling with the data; it makes the multi-tenant story real at the data layer.
- **One platform covers several seams:** Postgres + Auth + Storage in one, so persistence, admin auth, and image hosting don't each need separate infra.
- **Generator-as-preloader keeps it simple:** decoupled from the app, trivially keeps "no AI at runtime," and separates bulk seeding from manual admin edits.
- **Contract over runtime:** the schema and API shape are what matter for scale; keeping them clean preserves the option to change runtimes later.

## Alternatives considered
- *Roll-your-own API (Fastify/Nest) on Render/Fly + Neon* — viable and more control, but more ops; Supabase gives Auth + Storage + RLS out of the box with a plain-Postgres exit. Revisit if we outgrow the platform layer.
- *DB-per-tenant or schema-per-tenant* — rejected for now: heavier than shared-DB + RLS, which is the lightweight standard and scales well for this size.
- *Generator as a live admin/runtime feature* — rejected: offline preloading is simpler, decoupled, and keeps the public app AI-free.
- *Custom auth* — rejected: no reason to hand-roll; Supabase Auth (or Clerk) is the cheaper seam.

## Consequences
- **Nothing is built in v1.** This ADR is parked; the roadmap continues on static/mock data.
- The cheap, non-sidetracking **data-access seam** is the one thing to introduce during the frontend phases (its own small change/ADR when done).
- Tenant config currently lives in code (`src/tenants`); a `tenants` table would mirror it for FK/isolation when the backend lands — config can stay code-owned or migrate later.
- The generator (ADR-0016) targets the canonical `Listing` schema and writes `published` rows.
- Promote this ADR to **Accepted** when the first real trigger (persistence, auth, or admin) arrives; until then, do not build.
