import { Check, Clock } from 'lucide-react'
import { useState } from 'react'
import { DemoActionDialog } from '../components/DemoActionDialog'
import { Avatar } from '../lib/Avatar'
import { Badge } from '../lib/Badge'
import { Button } from '../lib/Button'
import { Card } from '../lib/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../lib/Tabs'
import { useListings } from '../components/useListings'
import { useI18n } from '../i18n/useI18n'
import { useSession } from '../session/useSession'
import { useTenant } from '../tenants/useTenant'

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || 'H'
}

export function HostDashboardPage() {
  const { tenant, tenantId } = useTenant()
  const { t } = useI18n()
  const { account } = useSession()
  const { byTenant } = useListings()
  const listings = byTenant(tenantId)

  return (
    <section className="sj-section">
      <div className="sj-container">
        <Badge tone="accent">{tenant.name}</Badge>
        <h1 className="sj-display mt-4 text-6xl leading-none">{t('host.title')}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-text-muted">{t('host.body')}</p>
        {account ? (
          <div className="mt-6 flex items-center gap-3">
            <Avatar alt={account.name} label={initials(account.name)} size="md" src={account.photo} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">{t('host.hostingAs')}</p>
              <p className="font-bold">{account.name}</p>
            </div>
          </div>
        ) : null}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Metric label={t('host.response')} value="98%" />
          <Metric label={t('host.rating')} value="4.97" />
          <Metric label={t('host.repeat')} value="31%" />
        </div>
        <Tabs className="mt-8" defaultValue="reservations">
          <TabsList>
            <TabsTrigger value="reservations">{t('host.reservations')}</TabsTrigger>
            <TabsTrigger value="requests">{t('host.requests')}</TabsTrigger>
          </TabsList>
          <TabsContent className="mt-5 grid gap-4" value="reservations">
            {listings.slice(0, 2).map((listing) => (
              <ReservationCard key={listing.id} status={t('host.confirmed')} title={listing.title} />
            ))}
          </TabsContent>
          <TabsContent className="mt-5 grid gap-4" value="requests">
            {listings.slice(1, 3).map((listing) => (
              <ReservationCard actions key={listing.id} status={t('host.pending')} title={listing.title} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <p className="text-3xl font-extrabold">{value}</p>
      <p className="mt-1 text-sm text-text-muted">{label}</p>
    </Card>
  )
}

function ReservationCard({ actions, status, title }: { actions?: boolean; status: string; title: string }) {
  const { t } = useI18n()
  const [pending, setPending] = useState<'accept' | 'decline' | null>(null)

  return (
    <Card asChild className="flex flex-wrap items-center justify-between gap-4">
      <article>
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
          <Button onClick={() => setPending('decline')} size="sm" variant="secondary">{t('host.decline')}</Button>
          <Button onClick={() => setPending('accept')} size="sm" variant="accent">{t('host.accept')}</Button>
        </div>
      ) : null}
      <DemoActionDialog
        body={t(pending === 'decline' ? 'host.declinedBody' : 'host.acceptedBody')}
        onOpenChange={(open) => {
          if (!open) setPending(null)
        }}
        open={pending !== null}
        title={t(pending === 'decline' ? 'host.declinedTitle' : 'host.acceptedTitle')}
      />
      </article>
    </Card>
  )
}
