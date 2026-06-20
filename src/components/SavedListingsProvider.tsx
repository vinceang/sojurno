import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useI18n } from '../i18n/useI18n'
import { useSession } from '../session/useSession'
import { LoginDialog } from './LoginDialog'
import { SavedContext, type SavedContextValue } from './saved-context'
import { useToast } from './useToast'

const SAVED_KEY = 'sojurno.saved'

function readSaved(): Set<string> {
  if (typeof localStorage === 'undefined') return new Set()
  try {
    const raw = JSON.parse(localStorage.getItem(SAVED_KEY) ?? '[]')
    return new Set(Array.isArray(raw) ? (raw as string[]) : [])
  } catch {
    return new Set()
  }
}

/**
 * Owns the saved-listings set (persisted to localStorage) and the save/login-gate flow (→ ADR-0025).
 * Holding it in context means every heart on a page stays in sync. Saving is gated behind a session:
 * anonymous saves open the in-context login modal and complete once signed in (as Test User).
 */
export function SavedListingsProvider({ children }: { children: React.ReactNode }) {
  const { t } = useI18n()
  const { authenticated } = useSession()
  const { toast } = useToast()
  const [saved, setSaved] = useState<Set<string>>(readSaved)
  const [loginOpen, setLoginOpen] = useState(false)
  const pending = useRef<{ id: string; label?: string } | null>(null)

  useEffect(() => {
    localStorage.setItem(SAVED_KEY, JSON.stringify([...saved]))
  }, [saved])

  const commitSave = useCallback(
    (id: string, label?: string) => {
      setSaved((prev) => new Set(prev).add(id))
      toast({ description: label ?? t('save.toastBody'), title: t('save.toastTitle'), tone: 'success' })
    },
    [t, toast],
  )

  const requestToggle = useCallback(
    (id: string, label?: string) => {
      if (saved.has(id)) {
        setSaved((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
        return
      }
      if (authenticated) {
        commitSave(id, label)
      } else {
        pending.current = { id, label }
        setLoginOpen(true)
      }
    },
    [authenticated, commitSave, saved],
  )

  const handleLoginSuccess = useCallback(() => {
    setLoginOpen(false)
    if (pending.current) {
      commitSave(pending.current.id, pending.current.label)
      pending.current = null
    }
  }, [commitSave])

  const value = useMemo<SavedContextValue>(
    () => ({ isSaved: (id) => saved.has(id), requestToggle }),
    [saved, requestToggle],
  )

  return (
    <SavedContext.Provider value={value}>
      {children}
      <LoginDialog
        onOpenChange={(open) => {
          setLoginOpen(open)
          if (!open) pending.current = null
        }}
        onSuccess={handleLoginSuccess}
        open={loginOpen}
      />
    </SavedContext.Provider>
  )
}
