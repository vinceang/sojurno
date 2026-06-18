import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from './utils'

export function DropdownMenu(props: ComponentPropsWithoutRef<typeof RadixDropdownMenu.Root>) {
  return <RadixDropdownMenu.Root {...props} />
}

export function DropdownMenuTrigger(
  props: ComponentPropsWithoutRef<typeof RadixDropdownMenu.Trigger>,
) {
  return <RadixDropdownMenu.Trigger {...props} />
}

export function DropdownMenuGroup(
  props: ComponentPropsWithoutRef<typeof RadixDropdownMenu.Group>,
) {
  return <RadixDropdownMenu.Group {...props} />
}

/** Themed, portalled menu surface (card chrome + elevation). */
export function DropdownMenuContent({
  align = 'end',
  className,
  sideOffset = 8,
  ...props
}: ComponentPropsWithoutRef<typeof RadixDropdownMenu.Content>) {
  return (
    <RadixDropdownMenu.Portal>
      <RadixDropdownMenu.Content
        align={align}
        className={cn(
          'z-50 min-w-44 overflow-hidden rounded-xl border border-border bg-card p-1 shadow-lg',
          className,
        )}
        sideOffset={sideOffset}
        {...props}
      />
    </RadixDropdownMenu.Portal>
  )
}

export function DropdownMenuItem({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadixDropdownMenu.Item>) {
  return (
    <RadixDropdownMenu.Item
      className={cn(
        'flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm outline-none transition data-[disabled]:pointer-events-none data-[disabled]:opacity-45 data-[highlighted]:bg-muted/60',
        className,
      )}
      {...props}
    />
  )
}

export function DropdownMenuSeparator({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadixDropdownMenu.Separator>) {
  return <RadixDropdownMenu.Separator className={cn('my-2 h-px bg-border', className)} {...props} />
}
