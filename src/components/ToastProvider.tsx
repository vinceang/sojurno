import { Check, Info, X } from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProviderPrimitive,
  ToastTitle,
  ToastViewport,
} from '../lib/Toast'
import { ToastContext, type ToastContextValue, type ToastOptions } from './toast-context'

const DURATION = 4000

type Current = ToastOptions & { key: number; path: string }

/**
 * App-level toast manager (→ ADR-0025). Singleton: only one toast at a time — a new `toast()`
 * replaces the current and resets its timer, so a gallery of hearts can't stack a pile of toasts.
 * Auto-dismisses after a timeout, is dismissable (close button + swipe), and is scoped to the page
 * that fired it (it captures the pathname and only renders while there), so it never outlives it.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<Current | null>(null)
  const [open, setOpen] = useState(false)
  const counter = useRef(0)
  const { pathname } = useLocation()

  const toast = useCallback(
    (options: ToastOptions) => {
      counter.current += 1
      setCurrent({ ...options, key: counter.current, path: pathname })
      setOpen(true)
    },
    [pathname],
  )

  const value = useMemo<ToastContextValue>(() => ({ toast }), [toast])

  // Scope to the firing page: once navigation changes the path, the toast unmounts.
  const visible = current !== null && current.path === pathname
  const Icon = current?.tone === 'success' ? Check : current?.tone === 'info' ? Info : null

  return (
    <ToastContext.Provider value={value}>
      <ToastProviderPrimitive duration={DURATION}>
        {children}
        {visible ? (
          <Toast key={current.key} onOpenChange={setOpen} open={open} tone={current.tone}>
            {Icon ? (
              <Icon
                aria-hidden="true"
                className={current.tone === 'success' ? 'mt-0.5 h-4 w-4 shrink-0 text-accent' : 'mt-0.5 h-4 w-4 shrink-0 text-text-muted'}
              />
            ) : null}
            <div className="min-w-0 flex-1">
              <ToastTitle>{current.title}</ToastTitle>
              {current.description ? <ToastDescription>{current.description}</ToastDescription> : null}
            </div>
            <ToastClose aria-label="Dismiss">
              <X aria-hidden="true" className="h-4 w-4" />
            </ToastClose>
          </Toast>
        ) : null}
        <ToastViewport />
      </ToastProviderPrimitive>
    </ToastContext.Provider>
  )
}
