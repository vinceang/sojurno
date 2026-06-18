import { MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import type { Collection } from '../types'

type CollectionCardProps = {
  collection: Collection
}

/**
 * A discovery tile (poster style: image-filled, title overlaid on a gradient) —
 * deliberately distinct from the image-top listing cards below it. Events carry
 * an accent date chip (time-sensitive); places show location only (evergreen).
 */
export function CollectionCard({ collection }: CollectionCardProps) {
  const { t } = useI18n()
  const href = `/t/${collection.tenant}/collections/${collection.id}`
  const meta = [collection.location, `${collection.listingIds.length} ${t('explore.stays')}`]
    .filter(Boolean)
    .join(' · ')

  return (
    <Link className="group relative block aspect-[2/1] overflow-hidden rounded-xl bg-muted" to={href}>
      <img
        alt={collection.image.alt}
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        loading="lazy"
        src={collection.image.src}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
      {collection.kind === 'event' && collection.dateLabel ? (
        <span className="absolute left-3 top-3 rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-accent">
          {collection.dateLabel}
        </span>
      ) : null}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="text-base font-bold leading-snug text-white">{collection.title}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-white/80">
          <MapPin aria-hidden="true" className="h-3 w-3 flex-shrink-0" />
          {meta}
        </p>
      </div>
    </Link>
  )
}
