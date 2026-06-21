import { useContext } from 'react'
import { ListingsContext } from './listings-context'

/**
 * Read listings through the hybrid source (→ ADR-0026): the curated build-time set merged with the
 * live user-created overlay. Use `byTenant`/`get` instead of importing the static accessors directly.
 */
export function useListings() {
  const context = useContext(ListingsContext)
  if (!context) {
    throw new Error('useListings must be used within UserListingsProvider')
  }
  return context
}
