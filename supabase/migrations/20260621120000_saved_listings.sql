-- ADR-0026 follow-up — move saved listings (hearts) from localStorage into the DB so they persist
-- per account across devices. A tiny join table; owner-scoped by RLS. Apply via the SQL editor.

create table if not exists public.saved_listings (
  user_id    uuid not null references auth.users (id) on delete cascade,
  listing_id text not null references public.listings (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

alter table public.saved_listings enable row level security;

-- Each user sees and manages only their own saves.
drop policy if exists "users read their own saves" on public.saved_listings;
create policy "users read their own saves"
  on public.saved_listings for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "users add their own saves" on public.saved_listings;
create policy "users add their own saves"
  on public.saved_listings for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "users remove their own saves" on public.saved_listings;
create policy "users remove their own saves"
  on public.saved_listings for delete to authenticated
  using (user_id = auth.uid());
