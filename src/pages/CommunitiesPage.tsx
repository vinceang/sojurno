import { Link } from 'react-router-dom'
import { CommunityCard } from '../components/CommunityCard'
import { Button } from '../lib/Button'
import { Eyebrow } from '../lib/Eyebrow'
import { SectionHeader } from '../lib/SectionHeader'
import { useI18n } from '../i18n/useI18n'
import { TENANTS } from '../tenants/tenants'

export function CommunitiesPage() {
  const { t } = useI18n()
  const active = TENANTS.filter((tenant) => tenant.active)
  const upcoming = TENANTS.filter((tenant) => !tenant.active)

  return (
    <section className="sj-section">
      <div className="sj-container">
        <SectionHeader
          as="h1"
          eyebrow={t('communities.eyebrow')}
          subtitle={t('communities.body')}
          title={t('communities.title')}
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {active.map((tenant) => (
            <CommunityCard key={tenant.id} tenant={tenant} />
          ))}
        </div>

        <div className="mt-14">
          <Eyebrow>{t('communities.devEyebrow')}</Eyebrow>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {upcoming.map((tenant) => (
              <CommunityCard key={tenant.id} tenant={tenant} />
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-md">
            <h2 className="text-xl font-bold">{t('communities.ctaTitle')}</h2>
            <p className="mt-1 text-sm leading-6 text-text-muted">{t('communities.ctaBody')}</p>
          </div>
          <Button asChild>
            <Link to="/start">{t('communities.ctaButton')}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
