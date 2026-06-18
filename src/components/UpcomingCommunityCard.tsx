import { useI18n } from '../i18n/useI18n'
import type { Tenant } from '../types'

type UpcomingCommunityCardProps = {
  tenant: Tenant
}

export function UpcomingCommunityCard({ tenant }: UpcomingCommunityCardProps) {
  const { t } = useI18n()

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative h-36 overflow-hidden bg-muted">
        <img
          alt={tenant.image.alt}
          className="h-full w-full object-cover opacity-60"
          loading="lazy"
          src={tenant.image.src}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-full bg-card/90 px-3 py-1 text-xs font-semibold shadow-sm">
            {t('communities.soon')}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold">{tenant.name}</h3>
        <p className="mt-1 text-xs leading-5 text-text-muted">{tenant.tagline}</p>
      </div>
    </article>
  )
}
