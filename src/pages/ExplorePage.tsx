import { LayoutGrid, ListFilter, Map } from 'lucide-react'
import { ListingCard } from '../components/ListingCard'
import { SearchPanel } from '../components/SearchPanel'
import { Badge } from '../lib/Badge'
import { Button } from '../lib/Button'
import { getListingsByTenant } from '../data/listings'
import { useI18n } from '../i18n/useI18n'
import { useTenant } from '../tenants/useTenant'

export function ExplorePage() {
  const { tenant, tenantId } = useTenant()
  const { t } = useI18n()
  const listings = getListingsByTenant(tenantId)

  return (
    <section className="sj-section">
      <div className="sj-container">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <Badge tone="accent">{tenant.name}</Badge>
            <h1 className="sj-display mt-4 text-6xl leading-none">{t('explore.title')}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-text-muted">{t('explore.body')} {tenant.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary">
              <ListFilter aria-hidden="true" className="h-4 w-4" />
              {t('explore.filters')}
            </Button>
            <Button variant="secondary">
              <Map aria-hidden="true" className="h-4 w-4" />
              {t('explore.map')}
            </Button>
            <Button variant="secondary">
              <LayoutGrid aria-hidden="true" className="h-4 w-4" />
              {t('explore.sort')}
            </Button>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {tenant.taxonomy.map((item) => (
            <Badge key={item} tone="outline">
              {item}
            </Badge>
          ))}
        </div>
        <div className="sticky top-16 z-30 mt-8 rounded-xl border border-border bg-background/95 p-3 shadow-sm backdrop-blur-sm">
          <SearchPanel compact defaultTenant={tenantId} />
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </section>
  )
}
