import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { cn } from './utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
  {
    variants: {
      tone: {
        neutral: 'bg-muted text-foreground',
        accent: 'bg-accent-soft text-accent',
        outline: 'border border-border bg-card text-text-muted',
      },
    },
    defaultVariants: {
      tone: 'neutral',
    },
  },
)

type BadgeProps = VariantProps<typeof badgeVariants> & {
  children: ReactNode
  className?: string
}

export function Badge({ children, className, tone }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)}>{children}</span>
}
