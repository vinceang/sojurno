import type { TenantId } from '../types'

type CommunityPillProps = {
  id: TenantId
  label: string
}

export function CommunityPill({ id, label }: CommunityPillProps) {
  return (
    <span
      className="community-pill inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
      data-community={id}
    >
      {label}
    </span>
  )
}
