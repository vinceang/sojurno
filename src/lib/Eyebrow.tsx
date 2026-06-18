import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { cn } from './utils'

const eyebrowVariants = cva('text-xs font-extrabold uppercase tracking-[0.2em]', {
  variants: {
    tone: {
      muted: 'text-text-muted',
      accent: 'text-accent',
    },
  },
  defaultVariants: {
    tone: 'muted',
  },
})

type EyebrowProps = VariantProps<typeof eyebrowVariants> & {
  children: ReactNode
  className?: string
}

/** The uppercase tracked kicker shown above a heading. */
export function Eyebrow({ children, className, tone }: EyebrowProps) {
  return <p className={cn(eyebrowVariants({ tone }), className)}>{children}</p>
}
