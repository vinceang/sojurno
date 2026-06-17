import { Globe, Menu, Moon, Sun } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Button } from '../lib/Button'
import { useTheme } from '../role/useTheme'
import { useI18n } from '../i18n/useI18n'
import type { Locale, Tenant } from '../types'
import { Brand } from './Brand'
import { CommunityMenu } from './CommunityMenu'

type HeaderProps = {
  tenant?: Tenant
}

const locales: Locale[] = ['en', 'es', 'fr']

export function Header({ tenant }: HeaderProps) {
  const { locale, setLocale, t } = useI18n()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const inHost = location.pathname.includes('/host')

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="sj-container flex h-16 items-center justify-between gap-4">
        <Brand tenantName={tenant?.name} />
        <nav aria-label="Primary" className="hidden items-center gap-2 md:flex">
          {tenant ? (
            <>
              <CommunityMenu activeId={tenant.id} />
              <NavLink className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-muted" to={`/t/${tenant.id}/explore`}>
                {t('nav.explore')}
              </NavLink>
              <NavLink className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-muted" to={`/t/${tenant.id}/host`}>
                {t('nav.host')}
              </NavLink>
              {inHost ? (
                <Button asChild size="sm" variant="secondary">
                  <Link to={`/t/${tenant.id}/explore`}>{t('nav.traveling')}</Link>
                </Button>
              ) : (
                <Button asChild size="sm" variant="accent">
                  <Link to={`/t/${tenant.id}/host`}>{t('nav.hosting')}</Link>
                </Button>
              )}
            </>
          ) : (
            <>
              <NavLink className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-muted" to="/communities">
                {t('nav.communities')}
              </NavLink>
              <NavLink className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-muted" to="/start">
                {t('nav.start')}
              </NavLink>
              <NavLink className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-muted" to="/design">
                {t('nav.design')}
              </NavLink>
            </>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <Button aria-label={theme === 'light' ? t('theme.dark') : t('theme.light')} onClick={toggleTheme} size="icon" variant="ghost">
            {theme === 'light' ? <Moon aria-hidden="true" className="h-4 w-4" /> : <Sun aria-hidden="true" className="h-4 w-4" />}
          </Button>
          <label className="hidden items-center gap-2 rounded-md border border-border bg-card px-2 py-2 text-sm font-semibold sm:flex">
            <Globe aria-hidden="true" className="h-4 w-4" />
            <span className="sr-only">Language</span>
            <select
              className="bg-transparent text-sm font-semibold outline-none"
              onChange={(event) => setLocale(event.target.value as Locale)}
              value={locale}
            >
              {locales.map((item) => (
                <option key={item} value={item}>
                  {item.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
          <Button aria-label={t('nav.menu')} className="md:hidden" size="icon" variant="secondary">
            <Menu aria-hidden="true" className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
