import { ArrowRight, Calendar, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CommunityCard } from '../components/CommunityCard'
import { ListingCard } from '../components/ListingCard'
import { Button } from '../lib/Button'
import { getListingsByTenant } from '../data/listings'
import { useI18n } from '../i18n/useI18n'
import { ACTIVE_TENANTS } from '../tenants/tenants'

export function LandingPage() {
  const { t } = useI18n()

  return (
    <>
      <section className="sj-container grid min-h-[calc(100vh-4rem)] items-center gap-10 py-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-accent">{t('landing.eyebrow')}</p>
          <h1 className="sj-display mt-5 max-w-4xl text-6xl leading-[0.95] md:text-7xl">{t('landing.title')}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-muted">{t('landing.body')}</p>
          <div className="mt-8 grid max-w-2xl gap-3 rounded-xl border border-border bg-card p-3 shadow-md md:grid-cols-[1fr_auto_auto]">
            <label className="flex min-h-12 items-center gap-3 rounded-lg bg-muted px-4 text-sm font-semibold text-text-muted">
              <Search aria-hidden="true" className="h-4 w-4" />
              <span>{t('landing.search')}</span>
            </label>
            <label className="flex min-h-12 items-center gap-3 rounded-lg bg-muted px-4 text-sm font-semibold text-text-muted">
              <Calendar aria-hidden="true" className="h-4 w-4" />
              <span>{t('landing.anyDates')}</span>
            </label>
            <Button asChild size="lg" variant="accent">
              <Link to="/communities">{t('landing.cta')}</Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-4">
          {ACTIVE_TENANTS.map((tenant) => (
            <CommunityCard key={tenant.id} tenant={tenant} />
          ))}
        </div>
      </section>

      <section className="sj-section border-y border-border bg-card/70">
        <div className="sj-container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-accent">{t('landing.communityRows')}</p>
              <h2 className="sj-display mt-2 text-4xl">{t('landing.howTitle')}</h2>
            </div>
            <Button asChild variant="secondary">
              <Link to="/communities">
                {t('nav.communities')} <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-8 space-y-12">
            {ACTIVE_TENANTS.map((tenant) => (
              <div key={tenant.id}>
                <h3 className="mb-4 text-lg font-extrabold">{tenant.name}</h3>
                <div className="grid gap-5 md:grid-cols-3">
                  {getListingsByTenant(tenant.id).map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sj-section">
        <div className="sj-container grid gap-5 md:grid-cols-3">
          {[
            [t('landing.stepOneTitle'), t('landing.stepOneBody')],
            [t('landing.stepTwoTitle'), t('landing.stepTwoBody')],
            [t('landing.stepThreeTitle'), t('landing.stepThreeBody')],
          ].map(([title, body], index) => (
            <article className="rounded-xl border border-border bg-card p-6 shadow-sm" key={title}>
              <span className="sj-display text-5xl text-accent/40">0{index + 1}</span>
              <h3 className="mt-6 text-lg font-extrabold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-text-muted">{body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
