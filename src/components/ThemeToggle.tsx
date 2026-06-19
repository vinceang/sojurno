import { Moon, Sun } from 'lucide-react'
import { useI18n } from '../i18n/useI18n'
import { useTheme } from '../theme/useTheme'

export function ThemeToggle() {
  const { t } = useI18n()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      aria-label={isDark ? t('nav.themeLight') : t('nav.themeDark')}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition hover:bg-muted/60 hover:text-foreground"
      onClick={toggleTheme}
      type="button"
    >
      {isDark ? (
        <Sun aria-hidden="true" className="h-4 w-4" />
      ) : (
        <Moon aria-hidden="true" className="h-4 w-4" />
      )}
    </button>
  )
}
