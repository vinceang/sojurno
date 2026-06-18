import * as RadixTooltip from '@radix-ui/react-tooltip'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from './utils'

export function TooltipProvider(props: ComponentPropsWithoutRef<typeof RadixTooltip.Provider>) {
  return <RadixTooltip.Provider {...props} />
}

export function Tooltip(props: ComponentPropsWithoutRef<typeof RadixTooltip.Root>) {
  return <RadixTooltip.Root {...props} />
}

export function TooltipTrigger(props: ComponentPropsWithoutRef<typeof RadixTooltip.Trigger>) {
  return <RadixTooltip.Trigger {...props} />
}

export function TooltipContent({
  className,
  sideOffset = 6,
  ...props
}: ComponentPropsWithoutRef<typeof RadixTooltip.Content>) {
  return (
    <RadixTooltip.Portal>
      <RadixTooltip.Content
        className={cn(
          'z-50 rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background shadow-md',
          className,
        )}
        sideOffset={sideOffset}
        {...props}
      />
    </RadixTooltip.Portal>
  )
}
