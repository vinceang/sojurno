import { createContext } from 'react'

export type ToastTone = 'default' | 'success' | 'info'

export type ToastOptions = {
  title: string
  description?: string
  tone?: ToastTone
}

export type ToastContextValue = {
  /** Show a toast. Singleton — a new toast replaces the current one and resets its timer. */
  toast: (options: ToastOptions) => void
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined)
