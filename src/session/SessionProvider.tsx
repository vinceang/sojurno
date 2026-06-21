import { useCallback, useEffect, useMemo, useState } from 'react'
import { DEMO_EMAIL, DEMO_PASSWORD, isSupabaseConfigured, supabase } from '../lib/supabase'
import {
  SessionContext,
  TEST_USER,
  type HostAccount,
  type SessionContextValue,
  type SessionMode,
} from './session-context'

const MODE_KEY = 'sojurno.mode'
const MOCK_AUTH_KEY = 'sojurno.authed' // mock-fallback only (no Supabase env)

function readMode(): SessionMode {
  try {
    return window.localStorage.getItem(MODE_KEY) === 'hosting' ? 'hosting' : 'traveling'
  } catch {
    return 'traveling'
  }
}

/**
 * Session bridge (→ ADR-0026). When Supabase is configured, `authenticated` reflects a real auth
 * session for the shared "Test User" account (login signs into it with the demo creds); when it's
 * not (local dev without keys), it falls back to a mock localStorage flag so the app still runs.
 * The identity is always Test User; `mode` (traveling/hosting) is persisted locally either way.
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  // Mock fallback seeds from localStorage synchronously; the Supabase session (when configured) is
  // confirmed by the effect's async getSession/onAuthStateChange below.
  const [authenticated, setAuthenticated] = useState(
    () => !supabase && window.localStorage.getItem(MOCK_AUTH_KEY) === 'true',
  )
  const [mode, setModeState] = useState<SessionMode>(readMode)

  useEffect(() => {
    if (!supabase) return
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (active) setAuthenticated(Boolean(data.session))
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(Boolean(session))
    })
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(MODE_KEY, mode)
  }, [mode])

  const login = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      // Always the shared Test User account, regardless of typed input (→ ADR-0024). The
      // onAuthStateChange listener flips `authenticated`.
      await supabase.auth.signInWithPassword({ email: DEMO_EMAIL!, password: DEMO_PASSWORD! })
    } else {
      window.localStorage.setItem(MOCK_AUTH_KEY, 'true')
      setAuthenticated(true)
    }
  }, [])

  const completeOnboarding = useCallback(async () => {
    // Shared-account model: onboarding signs into the same Test User identity and lands hosting.
    setModeState('hosting')
    await login()
  }, [login])

  const signOut = useCallback(() => {
    if (supabase) {
      void supabase.auth.signOut()
    } else {
      window.localStorage.setItem(MOCK_AUTH_KEY, 'false')
      setAuthenticated(false)
    }
  }, [])

  const setMode = useCallback((next: SessionMode) => setModeState(next), [])

  const account: HostAccount | null = authenticated ? TEST_USER : null

  const value = useMemo<SessionContextValue>(
    () => ({ account, authenticated, mode, completeOnboarding, login, signOut, setMode }),
    [account, authenticated, mode, completeOnboarding, login, signOut, setMode],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
