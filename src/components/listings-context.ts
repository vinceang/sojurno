import { createContext } from 'react'
import type { ActiveTenantId, Listing } from '../types'

export type ListingsContextValue = {
  /** Live user-created listings (source='user'), newest first. */
  userListings: Listing[]
  /** Listings for a tenant: live user listings first, then the curated build-time set. */
  byTenant: (tenant: ActiveTenantId) => Listing[]
  /** Find a listing by id across live + curated sets. */
  get: (id: string | undefined) => Listing | undefined
  /** Re-fetch the live overlay from Supabase. */
  refresh: () => Promise<void>
}

export const ListingsContext = createContext<ListingsContextValue | undefined>(undefined)
