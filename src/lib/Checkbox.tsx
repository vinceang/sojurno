import * as RadixCheckbox from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from './utils'

/** Token-themed checkbox; pass an accessible name via aria-label or aria-labelledby. */
export function Checkbox({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadixCheckbox.Root>) {
  return (
    <RadixCheckbox.Root
      className={cn(
        'flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border outline-none transition focus-visible:ring-2 focus-visible:ring-ring data-[state=checked]:border-accent data-[state=checked]:bg-accent',
        className,
      )}
      {...props}
    >
      <RadixCheckbox.Indicator>
        <Check aria-hidden="true" className="h-3.5 w-3.5 text-white" />
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  )
}
