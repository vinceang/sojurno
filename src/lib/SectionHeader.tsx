import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { Eyebrow } from './Eyebrow'
import { cn } from './utils'

const titleVariants = cva('sj-display leading-tight', {
  variants: {
    size: {
      md: 'text-3xl',
      lg: 'text-4xl md:text-5xl',
      xl: 'text-5xl md:text-6xl',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
})

type SectionHeaderProps = VariantProps<typeof titleVariants> & {
  title: ReactNode
  eyebrow?: string
  eyebrowTone?: 'muted' | 'accent'
  subtitle?: ReactNode
  align?: 'start' | 'center'
  /** Heading level — `h1` for page heroes, `h2` for in-page sections. */
  as?: 'h1' | 'h2'
  className?: string
}

/** Eyebrow + serif title + optional subtitle, with consistent rhythm. */
export function SectionHeader({
  align = 'start',
  as: Heading = 'h2',
  className,
  eyebrow,
  eyebrowTone = 'muted',
  size,
  subtitle,
  title,
}: SectionHeaderProps) {
  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      {eyebrow ? <Eyebrow tone={eyebrowTone}>{eyebrow}</Eyebrow> : null}
      <Heading className={cn(titleVariants({ size }), eyebrow ? 'mt-3' : '')}>{title}</Heading>
      {subtitle ? (
        <p className={cn('mt-4 text-lg leading-8 text-text-muted', align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl')}>
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
