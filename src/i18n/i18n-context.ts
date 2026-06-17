import { createContext } from 'react'
import type { MessageKey } from './messages'
import type { Locale } from '../types'

export type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: MessageKey) => string
}

export const I18nContext = createContext<I18nContextValue | undefined>(undefined)
