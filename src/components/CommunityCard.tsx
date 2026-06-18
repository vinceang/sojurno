import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../lib/Badge'
import { useI18n } from '../i18n/useI18n'
import type { Tenant } from '../types'

type CommunityCardProps = {
  tenant: Tenant
}

/**
 * One card for a community, with two states derived from `tenant.active`:
 * `active` — a link into the community (full poster + stats + trip-type chips);
 * `upcoming` — a non-interactive "coming soon" teaser.
 */
export function CommunityCard({ tenant }: CommunityCardProps) {
  const { t } = useI18n()

  if (!tenant.active) {
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

  return (
    <Link
      aria-label={`${t('communities.enterPrefix')} ${tenant.name}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      to={`/t/${tenant.id}/explore`}
    >
      <div className="relative h-56 overflow-hidden bg-muted sm:h-60">
        <img
          alt={tenant.image.alt}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          src={tenant.image.src}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="absolute bottom-4 left-5 flex items-center gap-2">
          <span
            className="community-pill rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide"
            data-community={tenant.id}
          >
            {t('communities.active')}
          </span>
          <span className="text-xs font-medium text-white/80">
            {tenant.stats.listings} {t('communities.listings')} · {tenant.stats.cities} {t('communities.cities')}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">{tenant.name}</h2>
          <ArrowRight
            aria-hidden="true"
            className="h-5 w-5 flex-shrink-0 text-text-muted transition group-hover:translate-x-0.5 group-hover:text-foreground"
          />
        </div>
        <p className="mt-2 text-sm font-medium text-text-muted">{tenant.tagline}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {tenant.taxonomy.map((item) => (
            <Badge key={item} tone="neutral">
              {item}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  )
}
