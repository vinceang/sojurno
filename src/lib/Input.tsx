import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from './utils'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        'min-h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none transition placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'
