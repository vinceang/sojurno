import { useMemo, useState } from 'react'
import { I18nContext, type I18nContextValue } from './i18n-context'
import { messages } from './messages'
import type { Locale } from '../types'

const LOCALES: Locale[] = ['en', 'es', 'fr']

function readInitialLocale(): Locale {
  const stored = window.localStorage.getItem('sojurno.locale')
  return LOCALES.includes(stored as Locale) ? (stored as Locale) : 'en'
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale)

  const value = useMemo<I18nContextValue>(() => {
    function setLocale(nextLocale: Locale) {
      window.localStorage.setItem('sojurno.locale', nextLocale)
      setLocaleState(nextLocale)
    }

    return {
      locale,
      setLocale,
      t: (key) => messages[locale][key],
    }
  }, [locale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
