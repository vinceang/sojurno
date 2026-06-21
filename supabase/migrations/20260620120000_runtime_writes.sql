-- ADR-0026 — activate runtime writes. The deployed app now writes listings + uploads images as the
-- shared "Test User" Supabase Auth account. Reads stay hybrid: the curated seed/generated rows ship
-- as the build-time export; user-created rows (source='user') are fetched live and merged.
-- Apply via the Supabase SQL editor (same flow as ADR-0022).

-- ── Ownership ────────────────────────────────────────────────────────────────────────────────
-- The seed/generated 29 keep owner_id null (not editable by any user); user rows carry the creator.
alter table public.listings
  add column if not exists owner_id uuid references auth.users (id) on delete set null;

-- ── Listings write policies (authenticated, owner-scoped) ───────────────────────────────────
-- Public SELECT of published rows already exists (ADR-0022). These add owner-scoped writes; anon
-- stays read-only. Inserts must claim ownership and be source='user', so the curated rows can't be
-- impersonated or overwritten.
drop policy if exists "authenticated can insert own listings" on public.listings;
create policy "authenticated can insert own listings"
  on public.listings for insert to authenticated
  with check (owner_id = auth.uid() and source = 'user');

drop policy if exists "authenticated can update own listings" on public.listings;
create policy "authenticated can update own listings"
  on public.listings for update to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "authenticated can delete own listings" on public.listings;
create policy "authenticated can delete own listings"
  on public.listings for delete to authenticated
  using (owner_id = auth.uid());

-- ── Storage: authenticated uploads to the public listing-images bucket ──────────────────────
-- Bucket is already public-read (ADR-0022). Allow authenticated uploads + owner cleanup.
drop policy if exists "authenticated can upload listing images" on storage.objects;
create policy "authenticated can upload listing images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'listing-images');

drop policy if exists "authenticated can delete own listing images" on storage.objects;
create policy "authenticated can delete own listing images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'listing-images' and owner = auth.uid());
