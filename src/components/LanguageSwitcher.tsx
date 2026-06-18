import { Check, ChevronDown, Globe } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../lib/DropdownMenu'
import { useI18n } from '../i18n/useI18n'
import type { Locale } from '../types'

const locales: { id: Locale; label: string; code: string }[] = [
  { id: 'en', label: 'English', code: 'EN' },
  { id: 'fr', label: 'Français', code: 'FR' },
  { id: 'es', label: 'Español', code: 'ES' },
]

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-text-muted transition hover:bg-muted/60 hover:text-foreground">
        <Globe aria-hidden="true" className="h-4 w-4" />
        <span>{locale.toUpperCase()}</span>
        <ChevronDown aria-hidden="true" className="h-3 w-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        {locales.map((item) => (
          <DropdownMenuItem key={item.id} onSelect={() => setLocale(item.id)}>
            <span className={locale === item.id ? 'font-bold text-foreground' : 'text-text-muted'}>
              {item.label}
            </span>
            <span className="flex items-center gap-2">
              <span className="font-mono text-xs text-text-muted">{item.code}</span>
              {locale === item.id ? (
                <Check aria-hidden="true" className="h-3.5 w-3.5 text-foreground" />
              ) : null}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
