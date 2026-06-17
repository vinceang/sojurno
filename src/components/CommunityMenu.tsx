import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Check, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { TENANTS } from '../tenants/tenants'
import type { TenantId } from '../types'

type CommunityMenuProps = {
  activeId?: TenantId
}

export function CommunityMenu({ activeId }: CommunityMenuProps) {
  const activeTenant = TENANTS.find((tenant) => tenant.id === activeId)

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-semibold">
        <span aria-hidden="true" className="community-dot h-2.5 w-2.5 rounded-full" data-community={activeId} />
        {activeTenant?.name ?? 'Communities'}
        <ChevronDown aria-hidden="true" className="h-4 w-4" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="z-50 w-72 rounded-xl border border-border bg-card p-2 shadow-lg"
          sideOffset={8}
        >
          {TENANTS.map((tenant) => {
            const content = (
              <span
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm transition hover:bg-muted"
                data-community={tenant.id}
              >
                <span className="flex items-center gap-3">
                  <span aria-hidden="true" className="community-dot h-2.5 w-2.5 rounded-full" />
                  <span>
                    <span className="block font-bold">{tenant.name}</span>
                    <span className="text-xs text-text-muted">
                      {tenant.active ? `${tenant.stats.listings} listings` : 'Coming soon'}
                    </span>
                  </span>
                </span>
                {tenant.id === activeId ? <Check aria-hidden="true" className="h-4 w-4 text-accent" /> : null}
              </span>
            )

            return tenant.active ? (
              <DropdownMenu.Item asChild key={tenant.id}>
                <Link to={`/t/${tenant.id}/explore`}>{content}</Link>
              </DropdownMenu.Item>
            ) : (
              <DropdownMenu.Item disabled key={tenant.id}>
                <span className="opacity-45">{content}</span>
              </DropdownMenu.Item>
            )
          })}
          <DropdownMenu.Separator className="my-2 h-px bg-border" />
          <DropdownMenu.Item asChild>
            <Link className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-muted" to="/communities">
              All communities
            </Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
