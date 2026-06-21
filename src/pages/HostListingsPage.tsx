import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { DemoActionDialog } from '../components/DemoActionDialog'
import { ListingCard } from '../components/ListingCard'
import { useListings } from '../components/useListings'
import { useToast } from '../components/useToast'
import { Badge } from '../lib/Badge'
import { Button } from '../lib/Button'
import { useI18n } from '../i18n/useI18n'
import { useSession } from '../session/useSession'
import { useTenant } from '../tenants/useTenant'

/**
 * Host listings management (→ ADR-0026 Phase 3): the signed-in account's own (source='user')
 * listings for this community, with add / edit / delete. Auth-gated.
 */
export function HostListingsPage() {
  const { tenant, tenantId } = useTenant()
  const { t } = useI18n()
  const { authenticated } = useSession()
  const { remove, userListings } = useListings()
  const { toast } = useToast()
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  if (!authenticated) return <Navigate replace to="/login" />

  const mine = userListings.filter((listing) => listing.tenant === tenantId)

  async function confirmDelete() {
    if (!pendingDelete) return
    const ok = await remove(pendingDelete)
    setPendingDelete(null)
    if (ok) toast({ title: t('hostListings.deletedToast'), tone: 'success' })
  }

  return (
    <section className="sj-section">
      <div className="sj-container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge tone="accent">{tenant.name}</Badge>
            <h1 className="sj-display mt-4 text-5xl leading-none md:text-6xl">{t('hostListings.title')}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-text-muted">{t('hostListings.body')}</p>
          </div>
          <Button asChild variant="accent">
            <Link to={`/t/${tenantId}/host/listings/new`}>
              <Plus aria-hidden="true" className="h-4 w-4" />
              {t('hostListings.add')}
            </Link>
          </Button>
        </div>

        {mine.length === 0 ? (
          <div className="mt-12 flex flex-col items-center gap-5 rounded-2xl border border-dashed border-border bg-card px-8 py-16 text-center">
            <p className="max-w-sm text-sm leading-6 text-text-muted">{t('hostListings.empty')}</p>
            <Button asChild variant="accent">
              <Link to={`/t/${tenantId}/host/listings/new`}>
                <Plus aria-hidden="true" className="h-4 w-4" />
                {t('hostListings.add')}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mine.map((listing) => (
              <div key={listing.id}>
                <ListingCard listing={listing} />
                <div className="mt-2 flex gap-2">
                  <Button asChild className="flex-1" size="sm" variant="secondary">
                    <Link to={`/t/${tenantId}/host/listings/${listing.id}/edit`}>
                      <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                      {t('hostListings.edit')}
                    </Link>
                  </Button>
                  <Button onClick={() => setPendingDelete(listing.id)} size="sm" variant="secondary">
                    <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                    {t('hostListings.delete')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <DemoActionDialog
          body={t('hostListings.deleteBody')}
          cancelLabel={t('hostListings.deleteCancel')}
          confirmLabel={t('hostListings.deleteConfirm')}
          onConfirm={confirmDelete}
          onOpenChange={(open) => {
            if (!open) setPendingDelete(null)
          }}
          open={pendingDelete !== null}
          title={t('hostListings.deleteTitle')}
        />
      </div>
    </section>
  )
}
