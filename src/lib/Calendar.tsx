import 'react-day-picker/style.css'
import { DayPicker } from 'react-day-picker'
import type { ComponentProps } from 'react'
import { cn } from './utils'

/**
 * Token-themed date picker (react-day-picker). Accent comes from --color-accent
 * via the .sj-calendar overrides in index.scss, so it re-points per tenant.
 * Not re-exported through the lib barrel — it carries a CSS side-effect import.
 */
export function Calendar({ className, ...props }: ComponentProps<typeof DayPicker>) {
  return <DayPicker className={cn('sj-calendar', className)} {...props} />
}
