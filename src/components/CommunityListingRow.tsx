import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ListingCard } from './ListingCard'
import type { Listing, Tenant } from '../types'

type CommunityListingRowProps = {
  eyebrow: string
  listings: Listing[]
  tenant: Tenant
  title: string
  viewAllLabel: string
}

export function CommunityListingRow({ eyebrow, listings, tenant, title, viewAllLabel }: CommunityListingRowProps) {
  return (
    <section className="space-y-7">
      <div className="flex items-end justify-between gap-5">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: tenant.brand.accent }}
            />
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-text-muted">{eyebrow}</p>
          </div>
          <h2 className="sj-display text-3xl leading-tight">{title}</h2>
        </div>
        <Link
          className="hidden flex-shrink-0 items-center gap-1.5 text-sm font-bold text-foreground transition hover:opacity-60 sm:inline-flex"
          to={`/t/${tenant.id}/explore`}
        >
          {viewAllLabel}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {listings.slice(0, 4).map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
      <Link
        className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground transition hover:opacity-60 sm:hidden"
        to={`/t/${tenant.id}/explore`}
      >
        {viewAllLabel}
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>
    </section>
  )
}
