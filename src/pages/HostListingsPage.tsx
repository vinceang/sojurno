import { Package } from 'lucide-react'
import { ListingCard } from '../components/ListingCard'
import { Badge } from '../lib/Badge'
import { getListingsByTenant } from '../data/listings'
import { useI18n } from '../i18n/useI18n'
import { useTenant } from '../tenants/useTenant'

export function HostListingsPage() {
  const { tenant, tenantId } = useTenant()
  const { t } = useI18n()
  const listings = getListingsByTenant(tenantId)
  const gear = listings.flatMap((listing) => listing.gear ?? [])

  return (
    <section className="sj-section">
      <div className="sj-container">
        <Badge tone="accent">{tenant.name}</Badge>
        <h1 className="sj-display mt-4 text-6xl leading-none">{t('hostListings.title')}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-text-muted">{t('hostListings.body')}</p>
        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_22rem]">
          <div className="grid gap-5 md:grid-cols-2">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          {gear.length ? (
            <aside className="h-fit rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="flex items-center gap-2 font-extrabold">
                <Package aria-hidden="true" className="h-5 w-5 text-accent" />
                {t('hostListings.gear')}
              </h2>
              <div className="mt-4 grid gap-3">
                {gear.map((item) => (
                  <div className="rounded-lg border border-border p-3" key={item.id}>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-text-muted">{item.category} · Qty {item.quantity}</p>
                  </div>
                ))}
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </section>
  )
}
