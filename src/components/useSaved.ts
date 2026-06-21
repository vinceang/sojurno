import { useContext } from 'react'
import { SavedContext } from './saved-context'

/** Full saved-listings context (ids + helpers). For a single listing's state, use `useSavedListing`. */
export function useSaved() {
  const context = useContext(SavedContext)
  if (!context) {
    throw new Error('useSaved must be used within SavedListingsProvider')
  }
  return context
}
