import { ArrowUpRight, Check, ChevronRight, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Link, Navigate, useParams } from 'react-router-dom'
import { DemoActionDialog } from '../components/DemoActionDialog'
import { useDemoAction } from '../components/useDemoAction'
import { ListingActions } from '../components/ListingActions'
import { ListingGallery } from '../components/ListingGallery'
import { useListings } from '../components/useListings'
import { Avatar } from '../lib/Avatar'
import { Badge } from '../lib/Badge'
import { Button } from '../lib/Button'
import { Calendar } from '../lib/Calendar'
import { Checkbox } from '../lib/Checkbox'
import { Rating } from '../lib/Rating'
import { cn, formatCurrency } from '../lib/utils'
import { getGallery, getReviews } from '../data/listings'
import { useI18n } from '../i18n/useI18n'
import { useTenant } from '../tenants/useTenant'

const SERVICE_FEE = 42

export function ListingPage() {
  const { listingId } = useParams()
  const { tenant, tenantId } = useTenant()
  const { locale, t } = useI18n()
  const { get } = useListings()
  const listing = get(listingId)
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2026, 6, 18),
    to: new Date(2026, 6, 21),
  })
  const [datesOpen, setDatesOpen] = useState(false)
  const [gearIds, setGearIds] = useState<Set<string>>(() => new Set())
  const reserve = useDemoAction()

  const dateFmt = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : locale === 'fr' ? 'fr-FR' : 'en-US', {
        month: 'short',
        day: 'numeric',
      }),
    [locale],
  )
  const nights =
    range?.from && range.to
      ? Math.max(1, Math.round((range.to.getTime() - range.from.getTime()) / 86_400_000))
      : 0
  const stayTotal = listing ? listing.price * nights : 0
  const gallery = useMemo(() => (listing ? getGallery(listing) : []), [listing])

  if (!listing || listing.tenant !== tenantId) {
    return <Navigate to={`/t/${tenantId}/explore`} replace />
  }

  const reviews = getReviews(listing)
  const hasGear = tenant.capabilities.includes('gear') && listing.gear?.length
  const formatDate = (date?: Date) => (date ? dateFmt.format(date) : '—')

  return (
    <section className="sj-section sj-section-compact-top">
      <div className="sj-container">
        {/* Header */}
        <p className="flex items-center gap-1.5 text-sm text-text-muted">
          <Link className="sj-link hover:text-foreground" to={`/t/${tenantId}/explore`}>
            {tenant.name}
          </Link>
          <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
          <span>{listing.neighborhood}</span>
        </p>
        <div className="mt-3 flex flex-col gap-4 pb-8 sm:flex-row sm:items-start sm:justify-between sm:pb-0">
          <h1 className="sj-display max-w-4xl text-4xl leading-tight md:text-5xl">{listing.title}</h1>
          <ListingActions listing={listing} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-muted">
          <Rating count={listing.reviewCount} rating={listing.rating} />
          <span>
            {listing.neighborhood} · {listing.location}
          </span>
          <Badge tone="accent">{tenant.name}</Badge>
          {listing.bookingMode === 'external' ? <Badge tone="outline">{t('listing.externalBadge')}</Badge> : null}
        </div>

        {/* Gallery */}
        <div className="mt-6">
          <ListingGallery images={gallery} />
        </div>

        {/* Body */}
        <div className="mt-10 grid gap-10 pb-4 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {/* Host */}
            <div className="flex items-start gap-4 border-b border-border pb-8">
              <Avatar alt={listing.host.name} label={listing.host.avatar} size="lg" src={listing.host.avatarUrl} />
              <div className="flex-1">
                <h2 className="text-lg font-bold">
                  {t('listing.hostedBy')} {listing.host.name}
                </h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge tone="accent">{listing.host.badge}</Badge>
                </div>
                <p className="mt-3 text-sm italic leading-6 text-text-muted">“{listing.highlight}”</p>
              </div>
            </div>

            {/* Amenities */}
            <div className="border-b border-border pb-8">
              <h2 className="text-base font-bold">{t('listing.amenities')}</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {listing.amenities.map((amenity) => (
                  <AmenityRow icon={<Check aria-hidden="true" className="h-4 w-4 text-accent" />} key={amenity} label={amenity} />
                ))}
                <AmenityRow icon={<Check aria-hidden="true" className="h-4 w-4 text-accent" />} label={t('listing.flexibleCheckIn')} />
                <AmenityRow icon={<ShieldCheck aria-hidden="true" className="h-4 w-4 text-accent" />} label={t('listing.verifiedHostRow')} />
              </div>
            </div>

            {/* Gear (capability-gated) */}
            {hasGear ? (
              <div className="border-b border-border pb-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold">{t('listing.gearTitle')}</h2>
                    <p className="mt-1 text-sm text-text-muted">{t('listing.gearBody')}</p>
                  </div>
                  <Badge className="whitespace-nowrap" tone="accent">
                    {t('listing.hostLent')}
                  </Badge>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {listing.gear?.map((item) => {
                    const checked = gearIds.has(item.id)
                    return (
                      <label
                        className={cn(
                          'flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition',
                          checked ? 'border-accent bg-accent-soft' : 'border-border hover:bg-muted/60',
                        )}
                        key={item.id}
                      >
                        <Checkbox
                          aria-label={item.name}
                          checked={checked}
                          onCheckedChange={(value) => {
                            setGearIds((current) => {
                              const next = new Set(current)
                              if (value) next.add(item.id)
                              else next.delete(item.id)
                              return next
                            })
                          }}
                        />
                        <span>
                          <span className="block text-sm font-semibold">{item.name}</span>
                          <span className="text-xs text-text-muted">
                            {item.category} · Qty {item.quantity}
                          </span>
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>
            ) : null}

            {/* Reviews */}
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold">{t('listing.reviews')}</h2>
                <Rating count={listing.reviewCount} rating={listing.rating} />
              </div>
              <div className="mt-6 grid gap-8 sm:grid-cols-2">
                {reviews.map((review) => (
                  <div className="space-y-3" key={review.name}>
                    <div className="flex items-center gap-3">
                      <Avatar alt={review.name} label={review.name.slice(0, 1)} size="sm" src={review.avatarUrl} />
                      <div>
                        <p className="text-sm font-semibold">{review.name}</p>
                        <p className="text-xs text-text-muted">{review.date}</p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-text-muted">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking panel */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-lg lg:sticky lg:top-24">
              <p className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold">{formatCurrency(listing.price)}</span>
                <span className="text-sm text-text-muted">/ night</span>
              </p>
              <div className="mt-5 overflow-hidden rounded-xl border border-border text-sm">
                <button
                  aria-expanded={datesOpen}
                  className="grid w-full grid-cols-2 divide-x divide-border text-left transition hover:bg-muted/50"
                  onClick={() => setDatesOpen((open) => !open)}
                  type="button"
                >
                  <span className="p-3">
                    <span className="block text-xs font-bold uppercase tracking-wide text-text-muted">{t('listing.checkIn')}</span>
                    <span className="mt-1 block font-semibold">{formatDate(range?.from)}</span>
                  </span>
                  <span className="p-3">
                    <span className="block text-xs font-bold uppercase tracking-wide text-text-muted">{t('listing.checkOut')}</span>
                    <span className="mt-1 block font-semibold">{formatDate(range?.to)}</span>
                  </span>
                </button>
                {datesOpen ? (
                  <div className="flex justify-center border-t border-border p-2">
                    <Calendar mode="range" numberOfMonths={1} onSelect={setRange} selected={range} />
                  </div>
                ) : null}
                <div className="flex items-center justify-between border-t border-border p-3">
                  <span className="text-xs font-bold uppercase tracking-wide text-text-muted">{t('listing.nights')}</span>
                  <span className="font-semibold">{nights}</span>
                </div>
              </div>
              {listing.bookingMode === 'external' ? (
                <Button asChild className="mt-4 w-full" size="lg" variant="accent">
                  <a href={listing.externalUrl} rel="noreferrer" target="_blank">
                    {t('listing.external')} <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <Button className="mt-4 w-full" onClick={reserve.trigger} size="lg" variant="accent">
                  {t('listing.request')}
                </Button>
              )}
              <DemoActionDialog
                body={t('listing.requestDemoBody')}
                onOpenChange={reserve.setOpen}
                open={reserve.open}
                title={t('listing.requestDemoTitle')}
              />
              <div className="mt-5 space-y-2.5 text-sm">
                <Line label={`${formatCurrency(listing.price)} × ${nights}`} value={formatCurrency(stayTotal)} />
                <Line label={t('listing.serviceFee')} value={formatCurrency(SERVICE_FEE)} />
                <Line label={t('listing.total')} strong value={formatCurrency(stayTotal + SERVICE_FEE)} />
              </div>
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-accent-soft p-3 text-xs leading-relaxed text-accent">
                <ShieldCheck aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                <span>
                  {t('listing.verifiedPrefix')} {tenant.vocabulary.proof}.
                </span>
              </div>
            </div>
          </aside>
        </div>

        <p className="mt-12">
          <Link className="text-sm font-bold text-text-muted hover:text-foreground" to={`/t/${tenantId}/explore`}>
            ← {t('listing.backTo')} {tenant.name}
          </Link>
        </p>
      </div>
    </section>
  )
}

function AmenityRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent-soft">{icon}</span>
      <span className="text-sm">{label}</span>
    </div>
  )
}

function Line({ label, strong, value }: { label: string; strong?: boolean; value: string }) {
  return (
    <div className={strong ? 'flex justify-between border-t border-border pt-2.5 text-base font-extrabold' : 'flex justify-between text-text-muted'}>
      <span>{label}</span>
      <span className={strong ? '' : 'text-foreground'}>{value}</span>
    </div>
  )
}
