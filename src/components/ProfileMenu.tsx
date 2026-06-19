import { ChevronDown, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar } from '../lib/Avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../lib/DropdownMenu'
import { useI18n } from '../i18n/useI18n'
import { useSession } from '../session/useSession'
import { DEFAULT_TENANT } from '../tenants/tenants'

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || 'H'
}

export function ProfileMenu() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { account, authenticated, mode, setMode, signOut } = useSession()

  const toggleMode = () => {
    if (mode === 'hosting') {
      setMode('traveling')
      navigate('/')
    } else {
      setMode('hosting')
      navigate(`/t/${DEFAULT_TENANT}/host`)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex min-h-9 items-center gap-2 rounded-full border border-border bg-card px-2 py-1 text-sm font-semibold transition hover:bg-muted/60">
        {authenticated && account ? (
          <Avatar alt={account.name} label={initials(account.name)} size="sm" src={account.photo} />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-text-muted">
            <User aria-hidden="true" className="h-4 w-4" />
          </span>
        )}
        <ChevronDown aria-hidden="true" className="h-4 w-4 text-text-muted" />
        <span className="sr-only">{t('account.menu')}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {authenticated ? (
          <>
            <DropdownMenuItem asChild>
              <Link to={`/t/${DEFAULT_TENANT}/host`}>{t('account.hostDashboard')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={toggleMode}>
              {mode === 'hosting' ? t('account.switchToTraveling') : t('account.switchToHosting')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={signOut}>{t('account.signOut')}</DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link to="/become-a-host">{t('account.becomeHost')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/login">{t('account.login')}</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
