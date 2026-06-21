import { createContext } from 'react'

/** The mock host identity created during onboarding (no real auth — ADR-0021). */
export type HostAccount = {
  name: string
  photo?: string
  blurb?: string
}

export type SessionMode = 'traveling' | 'hosting'

/** The fixed mock identity the login form always signs in as (→ ADR-0024). */
export const TEST_USER: HostAccount = { name: 'Test User' }

export type SessionContextValue = {
  /** The persisted mock identity; survives sign-out so re-login works. */
  account: HostAccount | null
  /** Whether there's an active (logged-in) session right now. */
  authenticated: boolean
  /** Current view mode for an authenticated host. */
  mode: SessionMode
  /** Onboarding submit → signs into the shared Test User session and lands in host mode. */
  completeOnboarding: () => Promise<void>
  /** Login → signs into the shared real "Test User" Supabase session (→ ADR-0024/0026). */
  login: () => Promise<void>
  /** Ends the active session. */
  signOut: () => void
  /** Switch the authenticated host between traveling and hosting. */
  setMode: (mode: SessionMode) => void
}

export const SessionContext = createContext<SessionContextValue | undefined>(undefined)
