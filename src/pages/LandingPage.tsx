import { ArrowRight, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CommunityListingRow } from '../components/CommunityListingRow'
import { SearchPanel } from '../components/SearchPanel'
import { Button } from '../lib/Button'
import { getListingsByTenant } from '../data/listings'
import { useI18n } from '../i18n/useI18n'
import { ACTIVE_TENANTS } from '../tenants/tenants'
import type { MessageKey } from '../i18n/messages'
import type { ActiveTenantId } from '../types'

const communityRows = [
  {
    eyebrowKey: 'landing.runnersEyebrow',
    tenantId: 'runners',
    titleKey: 'landing.runnersHeading',
  },
  {
    eyebrowKey: 'landing.hikersEyebrow',
    tenantId: 'hikers',
    titleKey: 'landing.hikersHeading',
  },
] satisfies Array<{
  eyebrowKey: MessageKey
  tenantId: ActiveTenantId
  titleKey: MessageKey
}>

export function LandingPage() {
  const { t } = useI18n()

  return (
    <>
      <section className="sj-container flex min-h-[calc(100vh-4rem)] items-center py-10">
        <div className="w-full max-w-5xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-accent">{t('landing.eyebrow')}</p>
          <h1 className="sj-display mt-5 max-w-4xl text-6xl leading-[0.95] md:text-7xl">{t('landing.title')}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-muted">{t('landing.body')}</p>
          <div className="mt-8">
            <SearchPanel showTenantSelect />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-background py-16 md:py-20">
        <div className="sj-container space-y-16">
          {communityRows.map((row) => {
            const tenant = ACTIVE_TENANTS.find((item) => item.id === row.tenantId)
            if (!tenant) return null

            return (
              <CommunityListingRow
                eyebrow={t(row.eyebrowKey)}
                key={tenant.id}
                listings={getListingsByTenant(tenant.id)}
                tenant={tenant}
                title={t(row.titleKey)}
                viewAllLabel={t('landing.viewAll')}
              />
            )
          })}

          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-dashed border-border bg-card/70 px-8 py-10 sm:flex-row sm:items-center md:px-12">
            <div className="flex items-start gap-5">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-border bg-background text-text-muted">
                <Plus aria-hidden="true" className="h-5 w-5" />
              </div>
              <div>
                <p className="mb-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-text-muted">
                  {t('landing.createEyebrow')}
                </p>
                <h2 className="sj-display text-2xl leading-tight">{t('landing.createHeading')}</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-text-muted">{t('landing.createBody')}</p>
              </div>
            </div>
            <Button asChild>
              <Link to="/start">
                {t('landing.createCta')}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-background py-24 md:py-32">
        <div className="sj-container">
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-text-muted">{t('landing.howEyebrow')}</p>
            <h2 className="sj-display mt-4 text-5xl leading-none md:text-6xl">{t('landing.howTitle')}</h2>
          </div>
          <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-3 md:gap-20">
            {[
              [t('landing.stepOneTitle'), t('landing.stepOneBody')],
              [t('landing.stepTwoTitle'), t('landing.stepTwoBody')],
              [t('landing.stepThreeTitle'), t('landing.stepThreeBody')],
            ].map(([title, body], index) => (
              <article className="grid grid-cols-[4.5rem_1fr] items-start gap-5 md:block" key={title}>
                <span className="sj-display block text-6xl leading-none text-[rgba(26,25,22,0.13)] md:text-8xl">0{index + 1}</span>
                <div>
                  <h3 className="pt-2 text-lg font-extrabold leading-tight md:mt-10 md:pt-0 md:text-xl">{title}</h3>
                  <p className="mt-4 max-w-sm text-sm leading-7 text-text-muted md:mt-6 md:text-base md:leading-8">{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
