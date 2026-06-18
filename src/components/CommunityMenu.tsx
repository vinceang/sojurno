import { Check, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../lib/DropdownMenu'
import { TENANTS } from '../tenants/tenants'
import type { TenantId } from '../types'

type CommunityMenuProps = {
  activeId?: TenantId
}

export function CommunityMenu({ activeId }: CommunityMenuProps) {
  const activeTenant = TENANTS.find((tenant) => tenant.id === activeId)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-semibold">
        <span aria-hidden="true" className="community-dot h-2.5 w-2.5 rounded-full" data-community={activeId} />
        {activeTenant?.name ?? 'Communities'}
        <ChevronDown aria-hidden="true" className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72">
        {TENANTS.map((tenant) => {
          const inner = (
            <>
              <span className="flex items-center gap-3" data-community={tenant.id}>
                <span aria-hidden="true" className="community-dot h-2.5 w-2.5 rounded-full" />
                <span>
                  <span className="block font-bold">{tenant.name}</span>
                  <span className="text-xs text-text-muted">
                    {tenant.active ? `${tenant.stats.listings} listings` : 'Coming soon'}
                  </span>
                </span>
              </span>
              {tenant.id === activeId ? (
                <Check aria-hidden="true" className="h-4 w-4 text-accent" />
              ) : null}
            </>
          )

          return tenant.active ? (
            <DropdownMenuItem asChild key={tenant.id}>
              <Link to={`/t/${tenant.id}/explore`}>{inner}</Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem disabled key={tenant.id}>
              {inner}
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link className="font-semibold" to="/communities">
            All communities
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
