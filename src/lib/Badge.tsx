import type { ReactNode } from 'react'
import { cn } from './utils'

type BadgeProps = {
  children: ReactNode
  className?: string
  tone?: 'neutral' | 'accent' | 'outline'
}

export function Badge({ children, className, tone = 'neutral' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
        tone === 'neutral' && 'bg-muted text-foreground',
        tone === 'accent' && 'bg-accent-soft text-accent',
        tone === 'outline' && 'border border-border bg-card text-text-muted',
        className,
      )}
    >
      {children}
    </span>
  )
}
