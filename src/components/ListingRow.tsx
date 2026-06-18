import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../lib/Badge'
import { Rating } from '../lib/Rating'
import { formatCurrency } from '../lib/utils'
import type { Listing } from '../types'

type ListingRowProps = {
  listing: Listing
}

/** The list-view presentation of a listing. Compact on phones, fuller on sm+. */
export function ListingRow({ listing }: ListingRowProps) {
  const href = `/t/${listing.tenant}/stays/${listing.id}`
  const price = (
    <p className="text-sm text-text-muted">
      <span className="text-lg font-extrabold text-foreground">{formatCurrency(listing.price)}</span> / night
    </p>
  )

  return (
    <article className="group border-b border-border last:border-b-0">
      {/* Phone: 2:1 thumbnail left; title + location; rating·price on one row */}
      <div className="flex gap-3 py-4 sm:hidden">
        <Link
          className="relative block aspect-[3/2] w-32 shrink-0 overflow-hidden rounded-md bg-muted"
          to={href}
        >
          <img
            alt={listing.images[0]?.alt ?? listing.title}
            className="h-full w-full object-cover"
            loading="lazy"
            src={listing.images[0]?.src}
          />
        </Link>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug">
            <Link to={href}>{listing.title}</Link>
          </h3>
          <p className="mt-0.5 truncate text-xs text-text-muted">
            {listing.neighborhood} · {listing.location}
          </p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <Rating count={listing.reviewCount} rating={listing.rating} />
            <p className="text-sm text-text-muted">
              <span className="font-extrabold text-foreground">{formatCurrency(listing.price)}</span> / night
            </p>
          </div>
        </div>
      </div>

      {/* sm+: thumbnail, details (quote + tags), right-rail rating/price */}
      <div className="hidden gap-5 py-5 sm:flex">
        <Link
          className="relative block aspect-[4/3] w-44 shrink-0 overflow-hidden rounded-lg bg-muted"
          to={href}
        >
          <img
            alt={listing.images[0]?.alt ?? listing.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
            src={listing.images[0]?.src}
          />
        </Link>
        <div className="flex min-w-0 flex-1 gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold leading-snug">
              <Link to={href}>{listing.title}</Link>
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              {listing.neighborhood} · {listing.location}
            </p>
            <p className="mt-2 line-clamp-1 text-sm italic text-text-muted">“{listing.highlight}”</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {listing.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} tone="outline">
                  {tag}
                </Badge>
              ))}
              {listing.bookingMode === 'external' ? (
                <Badge tone="outline">
                  <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
                  External
                </Badge>
              ) : null}
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end justify-between text-right">
            <Rating count={listing.reviewCount} rating={listing.rating} />
            {price}
          </div>
        </div>
      </div>
    </article>
  )
}
