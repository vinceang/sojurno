import { createContext } from 'react'
import type { ActiveTenantId, Listing } from '../types'

/** The editable fields a host provides when creating/editing a listing. */
export type ListingInput = {
  tenant: ActiveTenantId
  title: string
  location: string
  neighborhood: string
  price: number
  description: string
  highlight: string
  tags: string[]
  amenities: string[]
  /** Existing image URL to keep (edit), if no new file is chosen. */
  imageUrl?: string
  /** A newly chosen file to upload to Storage. */
  imageFile?: File
}

export type ListingsContextValue = {
  /** Live user-created listings (source='user'), newest first. */
  userListings: Listing[]
  /** Listings for a tenant: live user listings first, then the curated build-time set. */
  byTenant: (tenant: ActiveTenantId) => Listing[]
  /** Find a listing by id across live + curated sets. */
  get: (id: string | undefined) => Listing | undefined
  /** Re-fetch the live overlay from Supabase. */
  refresh: () => Promise<void>
  /** Create a listing owned by the signed-in account. Returns the new listing, or null on failure. */
  create: (input: ListingInput) => Promise<Listing | null>
  /** Update one of your listings. Returns the updated listing, or null on failure. */
  update: (id: string, input: ListingInput) => Promise<Listing | null>
  /** Delete one of your listings. */
  remove: (id: string) => Promise<boolean>
}

export const ListingsContext = createContext<ListingsContextValue | undefined>(undefined)
