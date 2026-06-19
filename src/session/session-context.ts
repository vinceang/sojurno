import { createContext } from 'react'

/** The mock host identity created during onboarding (no real auth — ADR-0021). */
export type HostAccount = {
  name: string
  photo?: string
  blurb?: string
}

export type SessionMode = 'traveling' | 'hosting'

export type SessionContextValue = {
  /** The persisted mock identity; survives sign-out so re-login works. */
  account: HostAccount | null
  /** Whether there's an active (logged-in) session right now. */
  authenticated: boolean
  /** Current view mode for an authenticated host. */
  mode: SessionMode
  /** Onboarding submit → creates the identity and lands authenticated in host mode. */
  completeOnboarding: (account: HostAccount) => void
  /** Fake login → re-authenticates into the existing persisted identity. */
  login: () => void
  /** Clears the active session (keeps the identity so login works again). */
  signOut: () => void
  /** Switch the authenticated host between traveling and hosting. */
  setMode: (mode: SessionMode) => void
}

export const SessionContext = createContext<SessionContextValue | undefined>(undefined)
