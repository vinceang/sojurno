-- Phase F / ADR-0022 — listing persistence (promotes ADR-0017).
-- Mirrors src/types.ts `Listing`. The offline generator (scripts/generate-listings.ts) writes
-- here with the service-role key (bypasses RLS); the app does NOT read at runtime today — it
-- reads a build-time export (scripts/export-listings.ts → src/data/listings.generated.ts).
-- RLS below is for the FUTURE runtime-read option and is harmless now.

-- ── tenants ────────────────────────────────────────────────────────────────────────────────
-- Mirrors src/tenants/tenants.ts (FK / isolation anchor per ADR-0002 / ADR-0017).
create table if not exists public.tenants (
  id     text primary key,          -- 'runners' | 'hikers' | ... (matches TenantId)
  slug   text not null,
  name   text not null,
  active boolean not null default false
);

-- ── listings ───────────────────────────────────────────────────────────────────────────────
create table if not exists public.listings (
  id            text primary key,                                    -- slug id
  tenant_id     text not null references public.tenants (id),
  booking_mode  text not null default 'native' check (booking_mode in ('native', 'external')),
  external_url  text,
  title         text not null,
  location      text not null,
  neighborhood  text not null,
  price         integer not null,
  rating        numeric(3, 2) not null default 4.90,
  review_count  integer not null default 0,
  host          jsonb not null,                                      -- { name, avatar, avatarUrl, badge, bio }
  images        jsonb not null default '[]'::jsonb,                  -- [{ src, alt }] — Supabase Storage URLs
  tags          text[] not null default '{}',
  amenities     text[] not null default '{}',
  highlight     text not null,
  description   text not null,
  gear          jsonb,                                               -- hikers only; null otherwise
  status        text not null default 'draft' check (status in ('draft', 'published')),
  source        text not null default 'generated' check (source in ('seed', 'generated')),
  created_at    timestamptz not null default now()
);

create index if not exists listings_tenant_status_idx
  on public.listings (tenant_id, status);

-- ── RLS (future runtime-read option; writes are service-role only) ─────────────────────────
alter table public.tenants  enable row level security;
alter table public.listings enable row level security;

-- Tenants are public reference data.
drop policy if exists "tenants are publicly readable" on public.tenants;
create policy "tenants are publicly readable"
  on public.tenants for select
  using (true);

-- Public reads see only published listings (engine/tenant isolation lands here when we add a
-- per-request tenant scope; for now published-only is the contract).
drop policy if exists "published listings are publicly readable" on public.listings;
create policy "published listings are publicly readable"
  on public.listings for select
  using (status = 'published');

-- No insert/update/delete policies → anon/authenticated writes are denied. The generator runs
-- as the service role, which bypasses RLS.

-- ── Storage: public bucket for AI-generated listing images (ADR-0016) ──────────────────────
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

-- ── Seed tenants (mirror src/tenants/tenants.ts) ───────────────────────────────────────────
insert into public.tenants (id, slug, name, active) values
  ('runners',         'runners',         'Runners',         true),
  ('hikers',          'hikers',          'Hikers',          true),
  ('cyclists',        'cyclists',        'Cyclists',        false),
  ('climbers',        'climbers',        'Climbers',        false),
  ('skiers',          'skiers',          'Skiers',          false),
  ('music-festivals', 'music-festivals', 'Music Festivals', false)
on conflict (id) do update
  set slug = excluded.slug, name = excluded.name, active = excluded.active;
