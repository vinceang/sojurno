import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Button } from '../lib/Button'
import type { Tenant } from '../types'
import { Brand } from './Brand'
import { CommunityMenu } from './CommunityMenu'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Header({ tenant }: { tenant?: Tenant }) {
  const { t } = useI18n()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeTenantId = tenant?.id ?? 'runners'
  const navItems = [
    { label: t('nav.communities'), to: '/communities' },
    { label: t('nav.explore'), to: `/t/${activeTenantId}/explore` },
    { label: t('nav.host'), to: `/t/${activeTenantId}/host` },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="sj-container flex h-16 items-center justify-between gap-4">
        <Brand />
        {tenant ? (
          <div className="hidden sm:block">
            <CommunityMenu activeId={tenant.id} />
          </div>
        ) : null}
        <nav aria-label="Primary" className="ml-auto hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `rounded-lg px-3 py-1.5 text-sm transition ${
                  isActive || (item.to.includes('/host') && location.pathname.includes('/host'))
                    ? 'font-semibold text-foreground'
                    : 'text-text-muted hover:text-foreground'
                }`
              }
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <span aria-hidden="true" className="mx-1 h-5 w-px bg-border" />
          <LanguageSwitcher />
          <span aria-hidden="true" className="mx-1 h-5 w-px bg-border" />
          <Button asChild size="sm" variant="secondary">
            <Link to="/start">{t('nav.signIn')}</Link>
          </Button>
          <Button asChild className="bg-[var(--color-foreground)] text-[var(--color-background)]" size="sm">
            <Link to={`/t/${activeTenantId}/host`}>{t('nav.startHosting')}</Link>
          </Button>
        </div>
        <Button
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? t('nav.close') : t('nav.menu')}
          className="md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          size="icon"
          variant="ghost"
        >
          {mobileOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
        </Button>
      </div>
      {mobileOpen ? (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                className="rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-muted/60"
                key={item.to}
                onClick={() => setMobileOpen(false)}
                to={item.to}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <LanguageSwitcher />
            <div className="flex gap-2">
              <Button asChild size="sm" variant="secondary">
                <Link to="/start">{t('nav.signIn')}</Link>
              </Button>
              <Button asChild className="bg-[var(--color-foreground)] text-[var(--color-background)]" size="sm">
                <Link to={`/t/${activeTenantId}/host`}>{t('nav.startHosting')}</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
