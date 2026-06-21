import { useCallback, useEffect, useMemo, useState } from 'react'
import { getListing, getListingsByTenant } from '../data/listings'
import { mapRowToListing } from '../data/mapListing'
import { supabase } from '../lib/supabase'
import type { ActiveTenantId } from '../types'
import { ListingsContext, type ListingsContextValue } from './listings-context'

/**
 * Live overlay for user-created listings (→ ADR-0026, hybrid reads). The curated 29 come from the
 * synchronous build-time export (`data/listings`); this fetches `source='user'` rows from Supabase
 * and merges them via `byTenant`/`get`. If the DB is unconfigured/asleep the overlay is simply empty
 * and the 29 still render — the app never blocks on it.
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

  const value = useMemo<ListingsContextValue>(
    () => ({ userListings, byTenant, get, refresh }),
    [userListings, byTenant, get, refresh],
  )

  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>
}
