import { CollectionCard } from './CollectionCard'
import type { Collection } from '../types'

type CollectionRailProps = {
  collections: Collection[]
  label: string
}

/** Horizontal snap-scroll rail of collection tiles. Label comes from tenant vocabulary. */
export function CollectionRail({ collections, label }: CollectionRailProps) {
  if (collections.length === 0) return null

  return (
    <section aria-label={label}>
      <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-text-muted">{label}</h2>
      <ul className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {collections.map((collection) => (
          <li className="w-[68%] shrink-0 snap-start sm:w-64" key={collection.id}>
            <CollectionCard collection={collection} />
          </li>
        ))}
      </ul>
    </section>
  )
}
