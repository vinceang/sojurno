import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from './utils'

const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'sj-button-primary px-5 py-2.5 shadow-sm hover:opacity-90',
        accent: 'bg-accent px-5 py-2.5 text-white shadow-sm hover:opacity-90',
        secondary: 'border border-border bg-card px-5 py-2.5 text-foreground hover:bg-muted',
        ghost: 'px-3 py-2 text-text-muted hover:bg-muted hover:text-foreground',
      },
      size: {
        sm: 'min-h-9 px-3 text-xs',
        md: 'min-h-11',
        lg: 'min-h-12 px-6 text-base',
        icon: 'h-11 w-11 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

export function Button({ asChild, className, size, variant, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ className, size, variant }))} {...props} />
}
