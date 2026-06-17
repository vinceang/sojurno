import * as Checkbox from '@radix-ui/react-checkbox'
import { ArrowUpRight, Check, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Avatar } from '../lib/Avatar'
import { Badge } from '../lib/Badge'
import { Button } from '../lib/Button'
import { Rating } from '../lib/Rating'
import { Stepper } from '../lib/Stepper'
import { formatCurrency } from '../lib/utils'
import { getListing } from '../data/listings'
import { useI18n } from '../i18n/useI18n'
import { useTenant } from '../tenants/useTenant'

export function ListingPage() {
  const { listingId } = useParams()
  const { tenant, tenantId } = useTenant()
  const { t } = useI18n()
  const listing = getListing(listingId)
  const [nights, setNights] = useState(3)
  const [gearIds, setGearIds] = useState<Set<string>>(() => new Set())

  const total = useMemo(() => listing ? listing.price * nights + 42 : 0, [listing, nights])

  if (!listing || listing.tenant !== tenantId) {
    return <Navigate to={`/t/${tenantId}/explore`} replace />
  }

  const hasGear = tenant.capabilities.includes('gear') && listing.gear?.length

  return (
    <section className="sj-section pt-8">
      <div className="sj-container">
        <div className="grid gap-8 lg:grid-cols-[1fr_23rem]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="accent">{tenant.name}</Badge>
              {listing.bookingMode === 'external' ? <Badge tone="outline">{t('listing.externalBadge')}</Badge> : null}
              <Rating count={listing.reviewCount} rating={listing.rating} />
            </div>
            <h1 className="sj-display mt-4 max-w-4xl text-6xl leading-none">{listing.title}</h1>
            <p className="mt-4 text-lg text-text-muted">{listing.neighborhood} · {listing.location}</p>
            <div className="mt-8 grid gap-3 md:grid-cols-[1.3fr_0.7fr]">
              <img
                alt={listing.images[0]?.alt ?? listing.title}
                className="h-full min-h-96 rounded-xl object-cover"
                src={listing.images[0]?.src}
              />
              <div className="grid gap-3">
                <Panel>
                  <div className="flex items-center gap-3">
                    <Avatar label={listing.host.avatar} />
                    <div>
                      <p className="text-sm text-text-muted">{t('listing.hostedBy')}</p>
                      <h2 className="font-extrabold">{listing.host.name}</h2>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-text-muted">{listing.host.bio}</p>
                </Panel>
                <Panel>
                  <ShieldCheck aria-hidden="true" className="h-6 w-6 text-accent" />
                  <h2 className="mt-3 font-extrabold">{t('listing.trust')}</h2>
                  <p className="mt-2 text-sm leading-6 text-text-muted">{listing.host.badge}</p>
                </Panel>
              </div>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-[1fr_0.8fr]">
              <Panel>
                <h2 className="text-xl font-extrabold">{t('listing.amenities')}</h2>
                <p className="mt-3 leading-7 text-text-muted">{listing.description}</p>
                <div className="mt-5 grid gap-3">
                  {listing.amenities.map((amenity) => (
                    <div className="flex items-center gap-3 text-sm font-semibold" key={amenity}>
                      <Check aria-hidden="true" className="h-4 w-4 text-accent" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </Panel>
              {hasGear ? (
                <Panel>
                  <h2 className="text-xl font-extrabold">{t('listing.gearTitle')}</h2>
                  <p className="mt-2 text-sm leading-6 text-text-muted">{t('listing.gearBody')}</p>
                  <div className="mt-5 grid gap-3">
                    {listing.gear?.map((item) => (
                      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-3 hover:bg-muted" key={item.id}>
                        <Checkbox.Root
                          checked={gearIds.has(item.id)}
                          className="mt-1 flex h-5 w-5 items-center justify-center rounded border border-border data-[state=checked]:border-accent data-[state=checked]:bg-accent"
                          onCheckedChange={(checked) => {
                            setGearIds((current) => {
                              const next = new Set(current)
                              if (checked) {
                                next.add(item.id)
                              } else {
                                next.delete(item.id)
                              }
                              return next
                            })
                          }}
                        >
                          <Checkbox.Indicator>
                            <Check aria-hidden="true" className="h-3.5 w-3.5 text-white" />
                          </Checkbox.Indicator>
                        </Checkbox.Root>
                        <span>
                          <span className="block text-sm font-extrabold">{item.name}</span>
                          <span className="text-xs text-text-muted">
                            {item.category} · Qty {item.quantity}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </Panel>
              ) : null}
            </div>
          </div>
          <aside className="h-fit rounded-xl border border-border bg-card p-5 shadow-lg lg:sticky lg:top-24">
            <p>
              <span className="text-2xl font-extrabold">{formatCurrency(listing.price)}</span>
              <span className="text-text-muted"> / night</span>
            </p>
            <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-lg border border-border text-sm">
              <div className="border-r border-border p-3">
                <span className="block text-xs font-bold uppercase text-text-muted">{t('listing.checkIn')}</span>
                Jul 18
              </div>
              <div className="p-3">
                <span className="block text-xs font-bold uppercase text-text-muted">{t('listing.checkOut')}</span>
                Jul 21
              </div>
            </div>
            <div className="mt-5">
              <Stepper label={t('listing.nights')} min={1} onChange={setNights} value={nights} />
            </div>
            {listing.bookingMode === 'external' ? (
              <Button asChild className="mt-5 w-full" size="lg" variant="accent">
                <a href={listing.externalUrl} rel="noreferrer" target="_blank">
                  {t('listing.external')} <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </a>
              </Button>
            ) : (
              <Button className="mt-5 w-full" size="lg" variant="accent">
                {t('listing.request')}
              </Button>
            )}
            <div className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
              <Line label={`${formatCurrency(listing.price)} × ${nights}`} value={formatCurrency(listing.price * nights)} />
              <Line label={t('listing.serviceFee')} value={formatCurrency(42)} />
              <Line label={t('listing.total')} strong value={formatCurrency(total)} />
            </div>
            <Button asChild className="mt-5 w-full" variant="secondary">
              <Link to={`/t/${tenantId}/explore`}>Back to {tenant.name}</Link>
            </Button>
          </aside>
        </div>
      </div>
    </section>
  )
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-border bg-card p-5 shadow-sm">{children}</div>
}

function Line({ label, strong, value }: { label: string; strong?: boolean; value: string }) {
  return (
    <div className={strong ? 'flex justify-between text-base font-extrabold' : 'flex justify-between text-text-muted'}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}
