import * as RadixSelect from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from './utils'

export function Select(props: ComponentPropsWithoutRef<typeof RadixSelect.Root>) {
  return <RadixSelect.Root {...props} />
}

export function SelectValue(props: ComponentPropsWithoutRef<typeof RadixSelect.Value>) {
  return <RadixSelect.Value {...props} />
}

export function SelectTrigger({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadixSelect.Trigger>) {
  return (
    <RadixSelect.Trigger
      className={cn(
        'inline-flex min-h-11 items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-ring data-[placeholder]:text-text-muted',
        className,
      )}
      {...props}
    >
      {children}
      <RadixSelect.Icon>
        <ChevronDown aria-hidden="true" className="h-4 w-4 text-text-muted" />
      </RadixSelect.Icon>
    </RadixSelect.Trigger>
  )
}

export function SelectContent({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadixSelect.Content>) {
  return (
    <RadixSelect.Portal>
      <RadixSelect.Content
        className={cn(
          'z-50 overflow-hidden rounded-xl border border-border bg-card p-1 shadow-lg',
          className,
        )}
        position="popper"
        sideOffset={6}
        {...props}
      >
        <RadixSelect.Viewport className="min-w-[var(--radix-select-trigger-width)]">
          {children}
        </RadixSelect.Viewport>
      </RadixSelect.Content>
    </RadixSelect.Portal>
  )
}

export function SelectItem({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadixSelect.Item>) {
  return (
    <RadixSelect.Item
      className={cn(
        'flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm outline-none transition data-[highlighted]:bg-muted/60',
        className,
      )}
      {...props}
    >
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
      <RadixSelect.ItemIndicator>
        <Check aria-hidden="true" className="h-4 w-4 text-accent" />
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  )
}
