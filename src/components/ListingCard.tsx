import { ArrowUpRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../lib/Badge'
import { Rating } from '../lib/Rating'
import { formatCurrency } from '../lib/utils'
import { TENANTS } from '../tenants/tenants'
import type { Listing } from '../types'
import { CommunityPill } from './CommunityPill'

type ListingCardProps = {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  const tenant = TENANTS.find((item) => item.id === listing.tenant)
  const href = `/t/${listing.tenant}/stays/${listing.id}`

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link className="relative block aspect-[4/3] overflow-hidden bg-muted" to={href}>
        <img
          alt={listing.images[0]?.alt ?? listing.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          src={listing.images[0]?.src}
        />
        {tenant ? (
          <span className="absolute left-3 top-3">
            <CommunityPill id={tenant.id} label={tenant.name} />
          </span>
        ) : null}
        {listing.bookingMode === 'external' ? (
          <span className="absolute right-3 top-3">
            <Badge className="bg-card/90 backdrop-blur" tone="outline">
              <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
              External
            </Badge>
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1 text-xs font-semibold uppercase text-text-muted">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
              {listing.neighborhood}
            </p>
            <h3 className="mt-1 min-h-12 text-base font-bold leading-snug">
              <Link to={href}>{listing.title}</Link>
            </h3>
          </div>
          <Rating rating={listing.rating} />
        </div>
        <p className="line-clamp-2 text-sm text-text-muted">{listing.highlight}</p>
        <div className="flex flex-wrap gap-2">
          {listing.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} tone="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="mt-auto border-t border-border pt-3">
          <p className="text-sm text-text-muted">
            <span className="text-lg font-extrabold text-foreground">{formatCurrency(listing.price)}</span> / night
          </p>
        </div>
      </div>
    </article>
  )
}
