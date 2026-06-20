import { useState } from 'react'

/**
 * Shared "saved listing" state, persisted to localStorage (→ ADR-0023, no backend). Backs both the
 * listing-detail Save action and the card heart, so a listing saved in one place reads as saved in
 * the other on next mount. A real micro-interaction without promising a saved-listings page.
 */
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

export function useSavedListing(id: string) {
  const [saved, setSaved] = useState(() => readSaved().has(id))

  function toggle() {
    const set = readSaved()
    if (set.has(id)) {
      set.delete(id)
    } else {
      set.add(id)
    }
    localStorage.setItem(SAVED_KEY, JSON.stringify([...set]))
    setSaved(set.has(id))
  }

  return { saved, toggle }
}
