import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useI18n } from '../i18n/useI18n'
import { supabase } from '../lib/supabase'
import { useSession } from '../session/useSession'
import { LoginDialog } from './LoginDialog'
import { SavedContext, type SavedContextValue } from './saved-context'
import { useToast } from './useToast'

/** Fetch the signed-in user's saved listing ids (newest first). Empty when unauthenticated. */
async function querySavedIds(authenticated: boolean): Promise<string[]> {
  if (!supabase || !authenticated) return []
  const { data, error } = await supabase
    .from('saved_listings')
    .select('listing_id')
    .order('created_at', { ascending: false })
  if (error || !data) return []
  return data.map((row) => row.listing_id as string)
}

/**
 * Owns saved listings (→ ADR-0025/0026), persisted **per account in Supabase** (RLS owner-scoped) so
 * saves follow the user across devices. Saving is gated behind login: anonymous saves open the
 * in-context login modal and complete once signed in. Holding the set in context keeps every heart
 * in sync across the page.
 */
export function SavedListingsProvider({ children }: { children: React.ReactNode }) {
  const { t } = useI18n()
  const { authenticated } = useSession()
  const { toast } = useToast()
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const [loginOpen, setLoginOpen] = useState(false)
  const pending = useRef<{ id: string; label?: string } | null>(null)

  // Load the user's saves when the auth state settles (and clear on sign-out). setState only in the
  // promise callback — no synchronous setState in the effect body.
  useEffect(() => {
    let active = true
    querySavedIds(authenticated).then((ids) => {
      if (active) setSaved(new Set(ids))
    })
    return () => {
      active = false
    }
  }, [authenticated])

  const commitSave = useCallback(
    async (id: string, label?: string) => {
      if (!supabase) return
      const { data } = await supabase.auth.getUser()
      const uid = data.user?.id
      if (!uid) return
      const { error } = await supabase.from('saved_listings').insert({ user_id: uid, listing_id: id })
      if (error) return
      setSaved((prev) => new Set(prev).add(id))
      toast({ description: label ?? t('save.toastBody'), title: t('save.toastTitle'), tone: 'success' })
    },
    [t, toast],
  )

  const requestToggle = useCallback(
    async (id: string, label?: string) => {
      if (saved.has(id)) {
        setSaved((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
        await supabase?.from('saved_listings').delete().eq('listing_id', id)
        return
      }
      if (authenticated) {
        await commitSave(id, label)
      } else {
        pending.current = { id, label }
        setLoginOpen(true)
      }
    },
    [authenticated, commitSave, saved],
  )

  const handleLoginSuccess = useCallback(() => {
    setLoginOpen(false)
    const p = pending.current
    pending.current = null
    if (p) void commitSave(p.id, p.label)
  }, [commitSave])

  const value = useMemo<SavedContextValue>(
    () => ({
      savedIds: [...saved],
      isSaved: (id) => saved.has(id),
      requestToggle: (id, label) => void requestToggle(id, label),
    }),
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
