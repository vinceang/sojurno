import { useCallback, useEffect, useMemo, useState } from 'react'
import { getListing, getListingsByTenant } from '../data/listings'
import { mapRowToListing } from '../data/mapListing'
import { supabase } from '../lib/supabase'
import type { ActiveTenantId, Listing } from '../types'
import { ListingsContext, type ListingInput, type ListingsContextValue } from './listings-context'

const BUCKET = 'listing-images'

/**
 * Live overlay for user-created listings (→ ADR-0026, hybrid reads). The curated 29 come from the
 * synchronous build-time export (`data/listings`); this fetches `source='user'` rows from Supabase
 * and merges them via `byTenant`/`get`, and owns create/update/delete. If the DB is unconfigured/
 * asleep the overlay is simply empty and the 29 still render — the app never blocks on it.
 */
/** Stateless fetch of the live user-listing overlay (no React state — safe to call from effects). */
async function queryUserListings() {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'published')
    .eq('source', 'user')
    .order('created_at', { ascending: false })
  if (error || !data) return []
  return data.map(mapRowToListing)
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)

/** Upload a new image to Storage and return its public URL (or the kept URL when no file given). */
async function resolveImageUrl(input: ListingInput, ownerId: string): Promise<string | undefined> {
  if (!input.imageFile || !supabase) return input.imageUrl
  const ext = input.imageFile.name.split('.').pop() ?? 'jpg'
  const path = `user/${ownerId}/${Date.now()}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, input.imageFile, { upsert: true })
  if (error) return input.imageUrl
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

/** Maps form input → the snake_case DB row columns shared by insert + update. */
function toRowFields(input: ListingInput, imageUrl: string | undefined) {
  return {
    tenant_id: input.tenant,
    title: input.title,
    location: input.location,
    neighborhood: input.neighborhood,
    price: input.price,
    description: input.description,
    highlight: input.highlight,
    tags: input.tags,
    amenities: input.amenities,
    images: imageUrl ? [{ src: imageUrl, alt: input.title }] : [],
  }
}

export function UserListingsProvider({ children }: { children: React.ReactNode }) {
  const [userListings, setUserListings] = useState<ListingsContextValue['userListings']>([])

  // Load once on mount; setState happens in the promise callback (not synchronously in the effect).
  useEffect(() => {
    let active = true
    queryUserListings().then((rows) => {
      if (active) setUserListings(rows)
    })
    return () => {
      active = false
    }
  }, [])

  // Manual re-fetch after a mutation (Phase 3).
  const refresh = useCallback(async () => {
    setUserListings(await queryUserListings())
  }, [])

  const byTenant = useCallback(
    (tenant: ActiveTenantId) => [
      ...userListings.filter((listing) => listing.tenant === tenant),
      ...getListingsByTenant(tenant),
    ],
    [userListings],
  )

  const get = useCallback(
    (id: string | undefined) => getListing(id) ?? userListings.find((listing) => listing.id === id),
    [userListings],
  )

  const create = useCallback(
    async (input: ListingInput): Promise<Listing | null> => {
      if (!supabase) return null
      const { data: userData } = await supabase.auth.getUser()
      const ownerId = userData.user?.id
      if (!ownerId) return null

      const imageUrl = await resolveImageUrl(input, ownerId)
      const id = `${slugify(input.location)}-${slugify(input.title).split('-').slice(0, 2).join('-')}-${Math.random().toString(36).slice(2, 6)}`
      const row = {
        id,
        owner_id: ownerId,
        source: 'user',
        status: 'published',
        booking_mode: 'native',
        rating: 5.0,
        review_count: 0,
        host: { name: 'Test User', avatar: 'TU', badge: 'Demo host', bio: 'A listing created in the Sojurno demo by the shared host account.' },
        ...toRowFields(input, imageUrl),
      }
      const { error } = await supabase.from('listings').insert(row)
      if (error) return null
      await refresh()
      return mapRowToListing(row)
    },
    [refresh],
  )

  const update = useCallback(
    async (id: string, input: ListingInput): Promise<Listing | null> => {
      if (!supabase) return null
      const { data: userData } = await supabase.auth.getUser()
      const ownerId = userData.user?.id
      if (!ownerId) return null

      const imageUrl = await resolveImageUrl(input, ownerId)
      const { data, error } = await supabase
        .from('listings')
        .update(toRowFields(input, imageUrl))
        .eq('id', id)
        .select('*')
        .single()
      if (error || !data) return null
      await refresh()
      return mapRowToListing(data)
    },
    [refresh],
  )

  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      if (!supabase) return false
      const { error } = await supabase.from('listings').delete().eq('id', id)
      if (error) return false
      await refresh()
      return true
    },
    [refresh],
  )

  const value = useMemo<ListingsContextValue>(
    () => ({ userListings, byTenant, get, refresh, create, update, remove }),
    [userListings, byTenant, get, refresh, create, update, remove],
  )

  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>
}
