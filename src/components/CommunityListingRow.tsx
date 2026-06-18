import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ListingCard } from './ListingCard'
import type { Listing, Tenant } from '../types'

type CommunityListingRowProps = {
  eyebrow: string
  listings: Listing[]
  tenant: Tenant
  title: string
  viewAllLabel: string
  prevLabel: string
  nextLabel: string
}

export function CommunityListingRow({
  eyebrow,
  listings,
  nextLabel,
  prevLabel,
  tenant,
  title,
  viewAllLabel,
}: CommunityListingRowProps) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const updateEdges = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 1)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1)
  }, [])

  useEffect(() => {
    updateEdges()
    window.addEventListener('resize', updateEdges)
    return () => window.removeEventListener('resize', updateEdges)
  }, [updateEdges])

  const scrollByPage = (dir: 1 | -1) => {
    const el = trackRef.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  return (
    <section className="space-y-7">
      <div className="flex items-end justify-between gap-5">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span aria-hidden="true" className="community-dot h-2 w-2 rounded-full" data-community={tenant.id} />
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

      <div className="relative">
        <button
          aria-label={prevLabel}
          className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition hover:bg-muted disabled:pointer-events-none disabled:opacity-0 sm:flex"
          disabled={atStart}
          onClick={() => scrollByPage(-1)}
          type="button"
        >
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        </button>
        <ul
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={updateEdges}
          ref={trackRef}
        >
          {listings.map((listing) => (
            <li
              className="w-[78%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3rem)/4)]"
              key={listing.id}
            >
              <ListingCard listing={listing} variant="compact" />
            </li>
          ))}
        </ul>
        <button
          aria-label={nextLabel}
          className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition hover:bg-muted disabled:pointer-events-none disabled:opacity-0 sm:flex"
          disabled={atEnd}
          onClick={() => scrollByPage(1)}
          type="button"
        >
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>
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
