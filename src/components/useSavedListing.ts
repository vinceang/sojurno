import { useContext } from 'react'
import { SavedContext } from './saved-context'

/**
 * Per-listing save state, backed by `SavedListingsProvider` (→ ADR-0025). Saving is gated behind a
 * session — `toggle` saves immediately when signed in, or opens the login modal when anonymous and
 * completes after sign-in. `label` (the listing title) enriches the success toast.
 */
export function useSavedListing(id: string, label?: string) {
  const context = useContext(SavedContext)
  if (!context) {
    throw new Error('useSavedListing must be used within SavedListingsProvider')
  }
  return {
    saved: context.isSaved(id),
    toggle: () => context.requestToggle(id, label),
  }
}
