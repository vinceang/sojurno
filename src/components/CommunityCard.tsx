import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../lib/Badge'
import { Button } from '../lib/Button'
import type { Tenant } from '../types'
import { CommunityPill } from './CommunityPill'

type CommunityCardProps = {
  tenant: Tenant
}

export function CommunityCard({ tenant }: CommunityCardProps) {
  return (
    <article
      className="community-tone flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm"
      data-community={tenant.id}
    >
      <div className="flex items-start justify-between gap-4">
        <CommunityPill id={tenant.id} label={tenant.name} />
        <Badge tone={tenant.active ? 'accent' : 'outline'}>{tenant.active ? 'Active' : 'Coming soon'}</Badge>
      </div>
      <h3 className="sj-display mt-7 text-3xl leading-tight">{tenant.tagline}</h3>
      <p className="mt-3 text-sm leading-6 text-text-muted">{tenant.description}</p>
      <div className="mt-5 flex gap-5 text-sm">
        <span>
          <strong>{tenant.stats.listings}</strong> listings
        </span>
        <span>
          <strong>{tenant.stats.cities}</strong> cities
        </span>
      </div>
      <div className="mt-auto pt-6">
        {tenant.active ? (
          <Button asChild variant="secondary">
            <Link to={`/t/${tenant.id}/explore`}>
              Enter community <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button disabled variant="secondary">
            In development
          </Button>
        )}
      </div>
    </article>
  )
}
