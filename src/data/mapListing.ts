import type { Listing } from '../types'

/**
 * Maps a Supabase `listings` row (snake_case) → app `Listing` (camelCase) — the runtime twin of
 * `scripts/export-listings.ts`'s `toListing`, used for the live user-listing overlay (ADR-0026).
 */
export function mapRowToListing(row: Record<string, unknown>): Listing {
  const listing: Listing = {
    id: String(row.id),
    tenant: row.tenant_id as Listing['tenant'],
    bookingMode: row.booking_mode as Listing['bookingMode'],
    title: String(row.title),
    location: String(row.location),
    neighborhood: String(row.neighborhood),
    price: Number(row.price),
    rating: Number(row.rating),
    reviewCount: Number(row.review_count),
    host: row.host as Listing['host'],
    images: (row.images as Listing['images']) ?? [],
    tags: (row.tags as string[]) ?? [],
    amenities: (row.amenities as string[]) ?? [],
    highlight: String(row.highlight),
    description: String(row.description),
  }
  if (row.external_url) listing.externalUrl = String(row.external_url)
  if (row.gear) listing.gear = row.gear as Listing['gear']
  return listing
}
