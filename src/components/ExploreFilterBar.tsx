import { Calendar, LayoutGrid, MapPin, Rows3, Search } from 'lucide-react'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../lib/Select'
import { cn } from '../lib/utils'
import { useI18n } from '../i18n/useI18n'
import type { Tenant } from '../types'
import { DemoActionDialog } from './DemoActionDialog'
import { useDemoAction } from './useDemoAction'

export type SortKey = 'recommended' | 'price' | 'rating'
export type ExploreView = 'grid' | 'list'

type ExploreFilterBarProps = {
  tenant: Tenant
  location: string
  onLocationChange: (value: string) => void
  perksActive: boolean
  onPerksToggle: () => void
  tripType: string
  onTripTypeChange: (value: string) => void
  sort: SortKey
  onSortChange: (value: SortKey) => void
  view: ExploreView
  onViewChange: (value: ExploreView) => void
}

const pill =
  'inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-card px-3.5 text-sm font-semibold text-foreground transition hover:bg-muted/60'

export function ExploreFilterBar({
  location,
  onLocationChange,
  onPerksToggle,
  onSortChange,
  onTripTypeChange,
  onViewChange,
  perksActive,
  sort,
  tenant,
  tripType,
  view,
}: ExploreFilterBarProps) {
  const { t } = useI18n()
  const [locationFocused, setLocationFocused] = useState(false)
  const locationExpanded = locationFocused || location.length > 0
  const dates = useDemoAction()

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Location — expands on focus */}
      <label
        className={cn(
          pill,
          'cursor-text transition-[width] duration-300 ease-out',
          locationExpanded ? 'w-64' : 'w-40',
        )}
      >
        <MapPin aria-hidden="true" className="h-4 w-4 flex-shrink-0 text-text-muted" />
        <span className="sr-only">{t('explore.anyLocation')}</span>
        <input
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:font-semibold placeholder:text-foreground"
          onBlur={() => setLocationFocused(false)}
          onChange={(event) => onLocationChange(event.target.value)}
          onFocus={() => setLocationFocused(true)}
          placeholder={t('explore.anyLocation')}
          type="search"
          value={location}
        />
        {locationExpanded ? <Search aria-hidden="true" className="h-4 w-4 flex-shrink-0 text-text-muted" /> : null}
      </label>

      {/* Dates — date filtering isn't built yet; stub with a coming-soon note (→ ADR-0023) */}
      <button className={pill} onClick={dates.trigger} type="button">
        <Calendar aria-hidden="true" className="h-4 w-4 text-text-muted" />
        {t('explore.anyDates')}
      </button>
      <DemoActionDialog
        body={t('explore.datesDemoBody')}
        onOpenChange={dates.setOpen}
        open={dates.open}
        title={t('explore.datesDemoTitle')}
      />

      {/* Trip type (tenant vocabulary) */}
      <Select onValueChange={onTripTypeChange} value={tripType}>
        <SelectTrigger className={cn(pill, 'min-w-0')}>
          <SelectValue placeholder={tenant.vocabulary.tripType} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{tenant.vocabulary.tripType}</SelectItem>
          {tenant.taxonomy.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Community signature quick-filter (tenant.vocabulary.filterPrimary) */}
      <button
        aria-pressed={perksActive}
        className={cn(
          'inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-sm font-semibold transition',
          perksActive
            ? 'border-accent bg-accent-soft text-accent'
            : 'border-border bg-card text-foreground hover:bg-muted/60',
        )}
        onClick={onPerksToggle}
        type="button"
      >
        {tenant.vocabulary.filterPrimary}
      </button>

      {/* Right side: sort + view toggle — own row until the hamburger breakpoint (md), grouped right */}
      <div className="flex w-full items-center justify-end gap-2 md:ml-auto md:w-auto">
        <Select onValueChange={(value) => onSortChange(value as SortKey)} value={sort}>
          <SelectTrigger className={cn(pill, 'min-w-0')}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">{t('explore.sort')}</SelectItem>
            <SelectItem value="price">{t('explore.sortPriceLow')}</SelectItem>
            <SelectItem value="rating">{t('explore.sortTopRated')}</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
          <button
            aria-label={t('explore.gridView')}
            aria-pressed={view === 'grid'}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full transition',
              view === 'grid' ? 'bg-foreground text-background' : 'text-text-muted hover:bg-muted/60',
            )}
            onClick={() => onViewChange('grid')}
            type="button"
          >
            <LayoutGrid aria-hidden="true" className="h-4 w-4" />
          </button>
          <button
            aria-label={t('explore.listView')}
            aria-pressed={view === 'list'}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full transition',
              view === 'list' ? 'bg-foreground text-background' : 'text-text-muted hover:bg-muted/60',
            )}
            onClick={() => onViewChange('list')}
            type="button"
          >
            <Rows3 aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
