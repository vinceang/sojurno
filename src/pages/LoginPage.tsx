import { Link, useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'
import { Button } from '../lib/Button'
import { SectionHeader } from '../lib/SectionHeader'
import { useI18n } from '../i18n/useI18n'
import { useSession } from '../session/useSession'
import { DEFAULT_TENANT } from '../tenants/tenants'

/**
 * Mock login page (→ ADR-0024). Renders the shared `LoginForm` (empty-field-only validation; signs
 * in as the fixed Test User identity). When already signed in, the form is replaced by a signed-in
 * note (no login button). The same form also appears in the save-gate's `LoginDialog`.
 */
export function LoginPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { account, authenticated } = useSession()

  return (
    <section className="sj-section">
      <div className="sj-container max-w-md">
        <SectionHeader
          as="h1"
          eyebrow={t('login.eyebrow')}
          eyebrowTone="accent"
          size="lg"
          subtitle={t('login.body')}
          title={t('login.title')}
        />

        {authenticated && account ? (
          <div className="mt-10 space-y-4 rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-text-muted">
              {t('login.signedInAs')} <span className="font-semibold text-foreground">{account.name}</span>.
            </p>
            <Button asChild className="w-full" size="lg" variant="accent">
              <Link to={`/t/${DEFAULT_TENANT}/host`}>{t('login.goDashboard')}</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10">
            <LoginForm onSuccess={() => navigate('/')} />
          </div>
        )}
      </div>
    </section>
  )
}
