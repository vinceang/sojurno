import { CommunityCard } from '../components/CommunityCard'
import { useI18n } from '../i18n/useI18n'
import { TENANTS } from '../tenants/tenants'

export function CommunitiesPage() {
  const { t } = useI18n()

  return (
    <section className="sj-section">
      <div className="sj-container">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-accent">{t('communities.eyebrow')}</p>
        <h1 className="sj-display mt-4 max-w-3xl text-6xl leading-none">{t('communities.title')}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-text-muted">{t('communities.body')}</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {TENANTS.map((tenant) => (
            <CommunityCard key={tenant.id} tenant={tenant} />
          ))}
        </div>
      </div>
    </section>
  )
}
