import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ListingCard } from '../components/ListingCard'
import { useSaved } from '../components/useSaved'
import { Button } from '../lib/Button'
import { SectionHeader } from '../lib/SectionHeader'
import { getListing } from '../data/listings'
import { useI18n } from '../i18n/useI18n'
import { useSession } from '../session/useSession'
import { ACTIVE_TENANTS, DEFAULT_TENANT } from '../tenants/tenants'

/**
 * The Saved view (→ ADR-0025 WS3): every stay the signed-in Test User has hearted, grouped by
 * community. Saving is gated behind login, so an anonymous visitor reaching `/saved` directly gets
 * a log-in prompt; a signed-in user with no saves gets an empty state.
 */
export function SavedPage() {
  const { t } = useI18n()
  const { authenticated } = useSession()
  const { savedIds } = useSaved()

  const savedListings = savedIds.map((id) => getListing(id)).filter((listing) => listing !== undefined)

  return (
    <section className="sj-section">
      <div className="sj-container">
        <SectionHeader
          as="h1"
          eyebrow={t('saved.eyebrow')}
          eyebrowTone="accent"
          size="lg"
          subtitle={t('saved.subtitle')}
          title={t('saved.title')}
        />

        {!authenticated ? (
          <Empty cta={<Button asChild variant="accent"><Link to="/login">{t('saved.loginCta')}</Link></Button>} message={t('saved.loginRequired')} />
        ) : savedListings.length === 0 ? (
          <Empty
            cta={<Button asChild variant="accent"><Link to={`/t/${DEFAULT_TENANT}/explore`}>{t('saved.emptyCta')}</Link></Button>}
            message={t('saved.empty')}
          />
        ) : (
          <div className="mt-10 space-y-12">
            {ACTIVE_TENANTS.map((tenant) => {
              const group = savedListings.filter((listing) => listing.tenant === tenant.id)
              if (group.length === 0) return null
              return (
                <div key={tenant.id}>
                  <h2 className="text-xs font-extrabold uppercase tracking-[0.22em] text-text-muted">{tenant.name}</h2>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {group.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

function Empty({ cta, message }: { cta: React.ReactNode; message: string }) {
  return (
    <div className="mt-12 flex flex-col items-center gap-5 rounded-2xl border border-dashed border-border bg-card px-8 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-text-muted">
        <Heart aria-hidden="true" className="h-5 w-5" />
      </span>
      <p className="max-w-sm text-sm leading-6 text-text-muted">{message}</p>
      {cta}
    </div>
  )
}
