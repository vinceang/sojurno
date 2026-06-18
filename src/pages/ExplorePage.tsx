import { useMemo, useState } from 'react'
import { ExploreFilterBar, type ExploreView, type SortKey } from '../components/ExploreFilterBar'
import { ListingCard } from '../components/ListingCard'
import { ListingRow } from '../components/ListingRow'
import { getListingsByTenant } from '../data/listings'
import { useI18n } from '../i18n/useI18n'
import { useTenant } from '../tenants/useTenant'

export function ExplorePage() {
  const { tenant, tenantId } = useTenant()
  const { t } = useI18n()
  const allListings = useMemo(() => getListingsByTenant(tenantId), [tenantId])

  const [location, setLocation] = useState('')
  const [perksActive, setPerksActive] = useState(false)
  const [tripType, setTripType] = useState('all')
  const [sort, setSort] = useState<SortKey>('recommended')
  const [view, setView] = useState<ExploreView>('grid')

  const listings = useMemo(() => {
    const query = location.trim().toLowerCase()
    const filtered = allListings.filter((listing) => {
      const matchesLocation =
        query.length === 0 ||
        listing.location.toLowerCase().includes(query) ||
        listing.neighborhood.toLowerCase().includes(query) ||
        listing.title.toLowerCase().includes(query)
      // The community's signature quick-filter narrows to directly-bookable stays.
      const matchesPerks = !perksActive || listing.bookingMode === 'native'
      return matchesLocation && matchesPerks
    })

    if (sort === 'price') return [...filtered].sort((a, b) => a.price - b.price)
    if (sort === 'rating') return [...filtered].sort((a, b) => b.rating - a.rating)
    return filtered
  }, [allListings, location, perksActive, sort])

  return (
    <>
      <section
        className="border-b border-border bg-accent-soft py-12"
        data-tenant={tenantId}
      >
        <div className="sj-container">
          <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-accent">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
            {tenant.name} {t('explore.communitySuffix')}
          </p>
          <h1 className="sj-display mt-3 max-w-3xl text-4xl leading-tight md:text-5xl">{tenant.tagline}</h1>
          <p className="mt-3 text-sm font-medium text-text-muted">
            {tenant.stats.listings} {t('explore.stays')} · {tenant.stats.cities} {t('explore.cities')}
          </p>
        </div>
      </section>

      <div className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="sj-container py-3">
          <ExploreFilterBar
            location={location}
            onLocationChange={setLocation}
            onPerksToggle={() => setPerksActive((active) => !active)}
            onSortChange={setSort}
            onTripTypeChange={setTripType}
            onViewChange={setView}
            perksActive={perksActive}
            sort={sort}
            tenant={tenant}
            tripType={tripType}
            view={view}
          />
        </div>
      </div>

      <section className="sj-section pt-8">
        <div className="sj-container">
          <p className="text-sm font-semibold text-text-muted">
            {listings.length} {t('explore.stays')}
          </p>

          {view === 'grid' ? (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="mt-2">
              {listings.map((listing) => (
                <ListingRow key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
