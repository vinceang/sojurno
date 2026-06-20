import { createContext } from 'react'

export type SavedContextValue = {
  /** Whether a listing id is currently saved. */
  isSaved: (id: string) => boolean
  /**
   * Toggle a save. Unsaving is immediate + silent. Saving requires a session (→ ADR-0025): if
   * signed in it saves + toasts; if anonymous it opens the login modal and completes after sign-in.
   * `label` (the listing title) enriches the success toast.
   */
  requestToggle: (id: string, label?: string) => void
}

export const SavedContext = createContext<SavedContextValue | undefined>(undefined)
