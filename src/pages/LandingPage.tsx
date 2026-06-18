import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CommunityListingRow } from '../components/CommunityListingRow'
import { SearchPanel } from '../components/SearchPanel'
import { Button } from '../lib/Button'
import { Eyebrow } from '../lib/Eyebrow'
import { SectionHeader } from '../lib/SectionHeader'
import { getListingsByTenant } from '../data/listings'
import { useI18n } from '../i18n/useI18n'
import { ACTIVE_TENANTS } from '../tenants/tenants'
import type { MessageKey } from '../i18n/messages'
import type { ActiveTenantId } from '../types'

const builderImage =
  'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1600&h=900&fit=crop&auto=format&q=80'

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
      <section className="sj-container grid items-center gap-10 py-14 md:gap-16 md:py-20 lg:grid-cols-[1.1fr_minmax(340px,400px)]">
        <div>
          <Eyebrow tone="accent">{t('landing.eyebrow')}</Eyebrow>
          <h1 className="sj-display mt-5 max-w-2xl text-5xl leading-[0.98] md:text-6xl">{t('landing.title')}</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-text-muted">{t('landing.body')}</p>
        </div>
        <div className="w-full">
          {/* < lg: full-width bar — stacks on phones, single row on tablet (less vertical scroll) */}
          <div className="lg:hidden">
            <SearchPanel showTenantSelect />
          </div>
          {/* lg+: stacked card beside the lead copy */}
          <div className="hidden lg:block">
            <SearchPanel showTenantSelect stacked />
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
                nextLabel={t('landing.nextListings')}
                prevLabel={t('landing.prevListings')}
                tenant={tenant}
                title={t(row.titleKey)}
                viewAllLabel={t('landing.viewAll')}
              />
            )
          })}

          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-dashed border-border bg-tertiary px-8 py-10 sm:flex-row sm:items-center md:px-12">
            <div>
              <Eyebrow className="mb-1.5">{t('landing.createEyebrow')}</Eyebrow>
              <h2 className="sj-display text-2xl leading-tight">{t('landing.createHeading')}</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-text-muted">{t('landing.createBody')}</p>
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

      <section className="border-y border-border bg-tertiary py-24 md:py-32">
        <div className="sj-container">
          <SectionHeader align="center" eyebrow={t('landing.howEyebrow')} size="xl" title={t('landing.howTitle')} />
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

      <section className="bg-background py-16 md:py-20">
        <div className="sj-container">
          <div className="relative overflow-hidden rounded-3xl bg-foreground">
            <img
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-40"
              loading="lazy"
              src={builderImage}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
            <div className="relative max-w-xl px-8 py-16 md:px-14 md:py-24">
              <Eyebrow className="text-white/60">{t('landing.builderEyebrow')}</Eyebrow>
              <h2 className="sj-display mt-5 text-4xl leading-tight text-white md:text-5xl">
                {t('landing.builderTitle')}
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-white/75">{t('landing.builderBody')}</p>
              <Button asChild className="mt-8 bg-white text-foreground hover:bg-white/90" variant="secondary">
                <Link to="/start">
                  {t('landing.builderCta')}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
