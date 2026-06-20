import { ChevronRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ListingCard } from '../components/ListingCard'
import { getCollection } from '../data/collections'
import { getListing } from '../data/listings'
import { useI18n } from '../i18n/useI18n'
import { useTenant } from '../tenants/useTenant'
import type { Listing } from '../types'

export function CollectionDetailPage() {
  const { collectionId } = useParams()
  const { tenant, tenantId } = useTenant()
  const { t } = useI18n()
  const collection = getCollection(collectionId)

  if (!collection || collection.tenant !== tenantId) {
    return <Navigate replace to={`/t/${tenantId}/explore`} />
  }

  const listings = collection.listingIds
    .map((id) => getListing(id))
    .filter((listing): listing is Listing => Boolean(listing))
  const meta = [collection.location, collection.dateLabel].filter(Boolean).join(' · ')

  return (
    <>
      <section className="relative overflow-hidden bg-foreground" data-tenant={tenantId}>
        <img
          alt={collection.image.alt}
          className="absolute inset-0 h-full w-full object-cover opacity-55"
          src={collection.image.src}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25" />
        <div className="sj-container relative py-20 md:py-28">
          <p className="flex items-center gap-1.5 text-sm text-white/70">
            <Link className="sj-link hover:text-white" to={`/t/${tenantId}/explore`}>
              {tenant.name}
            </Link>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
            <span>{collection.title}</span>
          </p>
          <h1 className="sj-display mt-4 max-w-3xl text-5xl leading-tight text-white md:text-6xl">
            {collection.title}
          </h1>
          {meta ? <p className="mt-3 text-sm font-medium uppercase tracking-wide text-white/70">{meta}</p> : null}
          <p className="mt-5 max-w-xl text-base leading-7 text-white/85">{collection.summary}</p>
        </div>
      </section>

      <section className="sj-section pt-12">
        <div className="sj-container">
          <h2 className="text-base font-bold">
            {listings.length} {t('explore.stays')} · {t('collections.staysIn')}
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
