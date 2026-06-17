import * as Tabs from '@radix-ui/react-tabs'
import { Check, Clock } from 'lucide-react'
import { Avatar } from '../lib/Avatar'
import { Badge } from '../lib/Badge'
import { Button } from '../lib/Button'
import { getListingsByTenant } from '../data/listings'
import { useI18n } from '../i18n/useI18n'
import { useTenant } from '../tenants/useTenant'

export function HostDashboardPage() {
  const { tenant, tenantId } = useTenant()
  const { t } = useI18n()
  const listings = getListingsByTenant(tenantId)

  return (
    <section className="sj-section">
      <div className="sj-container">
        <Badge tone="accent">{tenant.name}</Badge>
        <h1 className="sj-display mt-4 text-6xl leading-none">{t('host.title')}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-text-muted">{t('host.body')}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Metric label={t('host.response')} value="98%" />
          <Metric label={t('host.rating')} value="4.97" />
          <Metric label={t('host.repeat')} value="31%" />
        </div>
        <Tabs.Root className="mt-8" defaultValue="reservations">
          <Tabs.List className="inline-flex rounded-xl border border-border bg-card p-1">
            <Tab value="reservations">{t('host.reservations')}</Tab>
            <Tab value="requests">{t('host.requests')}</Tab>
          </Tabs.List>
          <Tabs.Content className="mt-5 grid gap-4" value="reservations">
            {listings.slice(0, 2).map((listing) => (
              <ReservationCard key={listing.id} status={t('host.confirmed')} title={listing.title} />
            ))}
          </Tabs.Content>
          <Tabs.Content className="mt-5 grid gap-4" value="requests">
            {listings.slice(1, 3).map((listing) => (
              <ReservationCard actions key={listing.id} status={t('host.pending')} title={listing.title} />
            ))}
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-3xl font-extrabold">{value}</p>
      <p className="mt-1 text-sm text-text-muted">{label}</p>
    </div>
  )
}

function Tab({ children, value }: { children: React.ReactNode; value: string }) {
  return (
    <Tabs.Trigger className="rounded-lg px-4 py-2 text-sm font-bold data-[state=active]:bg-muted" value={value}>
      {children}
    </Tabs.Trigger>
  )
}

function ReservationCard({ actions, status, title }: { actions?: boolean; status: string; title: string }) {
  const { t } = useI18n()

  return (
    <article className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <Avatar label="TV" />
        <div>
          <h2 className="font-extrabold">Taylor wants to stay</h2>
          <p className="text-sm text-text-muted">{title}</p>
        </div>
      </div>
      <Badge tone={actions ? 'outline' : 'accent'}>
        {actions ? <Clock aria-hidden="true" className="h-3.5 w-3.5" /> : <Check aria-hidden="true" className="h-3.5 w-3.5" />}
        {status}
      </Badge>
      {actions ? (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary">{t('host.decline')}</Button>
          <Button size="sm" variant="accent">{t('host.accept')}</Button>
        </div>
      ) : null}
    </article>
  )
}
