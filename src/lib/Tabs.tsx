import * as RadixTabs from '@radix-ui/react-tabs'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from './utils'

export function Tabs(props: ComponentPropsWithoutRef<typeof RadixTabs.Root>) {
  return <RadixTabs.Root {...props} />
}

export function TabsList({ className, ...props }: ComponentPropsWithoutRef<typeof RadixTabs.List>) {
  return (
    <RadixTabs.List
      className={cn('inline-flex rounded-xl border border-border bg-card p-1', className)}
      {...props}
    />
  )
}

export function TabsTrigger({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadixTabs.Trigger>) {
  return (
    <RadixTabs.Trigger
      className={cn(
        'rounded-lg px-4 py-2 text-sm font-bold outline-none transition focus-visible:ring-2 focus-visible:ring-ring data-[state=active]:bg-muted',
        className,
      )}
      {...props}
    />
  )
}

export function TabsContent({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadixTabs.Content>) {
  return <RadixTabs.Content className={cn('outline-none', className)} {...props} />
}
