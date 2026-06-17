import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './utils'

const avatarVariants = cva(
  'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary font-bold text-primary-foreground',
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-xs',
        md: 'h-11 w-11 text-sm',
        lg: 'h-14 w-14 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

type AvatarProps = VariantProps<typeof avatarVariants> & {
  /** Initials shown when no image is provided (and as the image alt fallback). */
  label: string
  src?: string
  alt?: string
  className?: string
}

export function Avatar({ alt, className, label, size, src }: AvatarProps) {
  return (
    <span className={cn(avatarVariants({ size }), className)}>
      {src ? (
        <img alt={alt ?? label} className="h-full w-full object-cover" src={src} />
      ) : (
        label
      )}
    </span>
  )
}
