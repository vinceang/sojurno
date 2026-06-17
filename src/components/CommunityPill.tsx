import type { TenantId } from '../types'

type CommunityPillProps = {
  id: TenantId
  label: string
}

export function CommunityPill({ id, label }: CommunityPillProps) {
  return (
    <span
      className="community-pill inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold"
      data-community={id}
    >
      <span aria-hidden="true" className="community-dot h-2 w-2 rounded-full" />
      {label}
    </span>
  )
}
