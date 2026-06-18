import * as RadixSwitch from '@radix-ui/react-switch'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from './utils'

/** Token-themed switch; pass an accessible name via an associated label or aria-label. */
export function Switch({ className, ...props }: ComponentPropsWithoutRef<typeof RadixSwitch.Root>) {
  return (
    <RadixSwitch.Root
      className={cn(
        'inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-muted px-0.5 outline-none transition focus-visible:ring-2 focus-visible:ring-ring data-[state=checked]:bg-accent',
        className,
      )}
      {...props}
    >
      <RadixSwitch.Thumb className="pointer-events-none block h-5 w-5 rounded-full bg-card shadow-sm transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
    </RadixSwitch.Root>
  )
}
