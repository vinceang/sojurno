export type Locale = 'en' | 'es' | 'fr'

export type TenantId =
  | 'runners'
  | 'hikers'
  | 'cyclists'
  | 'climbers'
  | 'skiers'
  | 'music-festivals'

export type ActiveTenantId = 'runners' | 'hikers'

export type Capability = 'gear' | 'collections'

export type BookingMode = 'native' | 'external'

export type ListingImage = {
  src: string
  alt: string
}

export type Review = {
  name: string
  avatarUrl: string
  date: string
  text: string
}

export type CollectionKind = 'event' | 'place'

export type Collection = {
  id: string
  tenant: ActiveTenantId
  kind: CollectionKind
  title: string
  summary: string
  image: ListingImage
  location?: string
  /** Display string for event-kind collections (no real date logic in v1). */
  dateLabel?: string
  listingIds: string[]
}

export type GearItem = {
  id: string
  name: string
  category: string
  icon: 'tent' | 'poles' | 'pack' | 'stove' | 'gps' | 'canister'
  quantity: number
  fee?: number
}

export type Listing = {
  id: string
  tenant: ActiveTenantId
  bookingMode: BookingMode
  externalUrl?: string
  title: string
  location: string
  neighborhood: string
  price: number
  rating: number
  reviewCount: number
  host: {
    name: string
    avatar: string
    avatarUrl?: string
    badge: string
    bio: string
  }
  images: ListingImage[]
  tags: string[]
  amenities: string[]
  highlight: string
  description: string
  gear?: GearItem[]
}

export type Tenant = {
  id: TenantId
  active: boolean
  name: string
  pluralName: string
  tagline: string
  description: string
  brand: {
    mark: string
    accent: string
    accentSoft: string
    typography: 'sojurno-shared'
  }
  vocabulary: {
    stayType: string
    proof: string
    filterPrimary: string
    tripType: string
    collectionsLabel: string
  }
  taxonomy: string[]
  trustSignals: string[]
  capabilities: Capability[]
  image: ListingImage
  stats: {
    listings: number
    cities: number
  }
}
