import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  SessionContext,
  type HostAccount,
  type SessionContextValue,
  type SessionMode,
} from './session-context'

const STORAGE_KEY = 'sojurno.session'

type PersistedState = {
  account: HostAccount | null
  authenticated: boolean
  mode: SessionMode
}

const EMPTY: PersistedState = { account: null, authenticated: false, mode: 'traveling' }

function readInitial(): PersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    return {
      account: parsed.account ?? null,
      authenticated: Boolean(parsed.authenticated),
      mode: parsed.mode === 'hosting' ? 'hosting' : 'traveling',
    }
  } catch {
    return EMPTY
  }
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(readInitial)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const completeOnboarding = useCallback((account: HostAccount) => {
    setState({ account, authenticated: true, mode: 'hosting' })
  }, [])

  const login = useCallback(() => {
    setState((s) => (s.account ? { ...s, authenticated: true } : s))
  }, [])

  const signOut = useCallback(() => {
    // Clear the active session but keep the identity so re-login works (ADR-0021 §3).
    setState((s) => ({ ...s, authenticated: false }))
  }, [])

  const setMode = useCallback((mode: SessionMode) => {
    setState((s) => ({ ...s, mode }))
  }, [])

  const value = useMemo<SessionContextValue>(
    () => ({
      account: state.account,
      authenticated: state.authenticated,
      mode: state.mode,
      completeOnboarding,
      login,
      signOut,
      setMode,
    }),
    [state, completeOnboarding, login, signOut, setMode],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
