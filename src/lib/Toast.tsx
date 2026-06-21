import * as RadixToast from '@radix-ui/react-toast'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from './utils'

/**
 * Themed Radix Toast primitives (transient, dismissable notifications). The app-level manager
 * (`components/ToastProvider`) composes these; callers fire toasts via `useToast()`.
 */

export function ToastProviderPrimitive(props: ComponentPropsWithoutRef<typeof RadixToast.Provider>) {
  return <RadixToast.Provider swipeDirection="right" {...props} />
}

export function ToastViewport({ className, ...props }: ComponentPropsWithoutRef<typeof RadixToast.Viewport>) {
  return (
    <RadixToast.Viewport
      className={cn(
        'fixed bottom-0 right-0 z-[100] m-0 flex w-[min(24rem,calc(100vw-2rem))] list-none flex-col gap-2 p-4 outline-none',
        className,
      )}
      {...props}
    />
  )
}

const toastVariants = cva(
  // `sj-toast` carries the enter/exit + swipe animation (driven by Radix data-state/data-swipe);
  // defined in styles/index.scss so it survives Tailwind v4 without tailwindcss-animate.
  'sj-toast pointer-events-auto flex items-start gap-3 rounded-xl border bg-card p-4 shadow-lg',
  {
    variants: {
      tone: {
        default: 'border-border',
        success: 'border-accent/40',
        info: 'border-border',
      },
    },
    defaultVariants: { tone: 'default' },
  },
)

type ToastProps = ComponentPropsWithoutRef<typeof RadixToast.Root> & VariantProps<typeof toastVariants>

export function Toast({ className, tone, ...props }: ToastProps) {
  return <RadixToast.Root className={cn(toastVariants({ tone }), className)} {...props} />
}

export function ToastTitle({ className, ...props }: ComponentPropsWithoutRef<typeof RadixToast.Title>) {
  return <RadixToast.Title className={cn('text-sm font-bold text-foreground', className)} {...props} />
}

export function ToastDescription({ className, ...props }: ComponentPropsWithoutRef<typeof RadixToast.Description>) {
  return <RadixToast.Description className={cn('mt-0.5 text-sm leading-snug text-text-muted', className)} {...props} />
}

export function ToastClose({ className, ...props }: ComponentPropsWithoutRef<typeof RadixToast.Close>) {
  return (
    <RadixToast.Close
      className={cn(
        'shrink-0 rounded-md p-1 text-text-muted outline-none transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      {...props}
    />
  )
}
