import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from './utils'

const cardVariants = cva('rounded-xl border border-border bg-card', {
  variants: {
    padding: {
      none: '',
      md: 'p-5',
      lg: 'p-6',
    },
    elevation: {
      none: '',
      sm: 'shadow-sm',
      lg: 'shadow-lg',
    },
  },
  defaultVariants: {
    padding: 'md',
    elevation: 'sm',
  },
})

type CardProps = ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof cardVariants> & {
    /** Render as the child element (e.g. an <article> or <aside>) while keeping card styling. */
    asChild?: boolean
  }

export function Card({ asChild, className, elevation, padding, ...props }: CardProps) {
  const Comp = asChild ? Slot : 'div'
  return <Comp className={cn(cardVariants({ elevation, padding }), className)} {...props} />
}
