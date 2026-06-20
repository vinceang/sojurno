import { type FormEvent, type ReactNode, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DemoActionDialog } from '../components/DemoActionDialog'
import { useDemoAction } from '../components/useDemoAction'
import { Button } from '../lib/Button'
import { Input } from '../lib/Input'
import { SectionHeader } from '../lib/SectionHeader'
import { useI18n } from '../i18n/useI18n'
import { useSession } from '../session/useSession'
import { DEFAULT_TENANT } from '../tenants/tenants'

/**
 * Mock login (→ ADR-0024). A real-looking form whose only validation is empty-field rejection —
 * any non-empty username/password passes and signs in as the fixed Test User identity. Forgot
 * password is a demo affordance (ADR-0023); Create an account links to onboarding. When already
 * signed in, the form is replaced by a signed-in note (no login button).
 */
export function LoginPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { account, authenticated, login } = useSession()
  const forgot = useDemoAction()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ password?: boolean; username?: boolean }>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = { password: password.trim() === '', username: username.trim() === '' }
    setErrors(next)
    if (next.username || next.password) return
    login()
    navigate('/')
  }

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
          <form className="mt-10 space-y-5" noValidate onSubmit={handleSubmit}>
            <Field error={errors.username ? t('login.errorUsername') : undefined} label={t('login.username')}>
              <Input
                aria-invalid={errors.username || undefined}
                autoComplete="username"
                className={errors.username ? 'border-danger' : undefined}
                onChange={(event) => setUsername(event.target.value)}
                placeholder={t('login.usernamePlaceholder')}
                value={username}
              />
            </Field>
            <Field error={errors.password ? t('login.errorPassword') : undefined} label={t('login.password')}>
              <Input
                aria-invalid={errors.password || undefined}
                autoComplete="current-password"
                className={errors.password ? 'border-danger' : undefined}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t('login.passwordPlaceholder')}
                type="password"
                value={password}
              />
            </Field>
            <div className="flex justify-end">
              <button
                className="sj-link text-sm font-semibold text-text-muted hover:text-foreground"
                onClick={forgot.trigger}
                type="button"
              >
                {t('login.forgot')}
              </button>
            </div>
            <Button className="w-full" size="lg" type="submit" variant="accent">
              {t('login.submit')}
            </Button>
            <p className="text-center text-sm text-text-muted">
              {t('login.noAccount')}{' '}
              <Link className="sj-link font-semibold text-foreground" to="/become-a-host">
                {t('login.createAccount')}
              </Link>
            </p>
          </form>
        )}

        <DemoActionDialog
          body={t('login.forgotBody')}
          onOpenChange={forgot.setOpen}
          open={forgot.open}
          title={t('login.forgotTitle')}
        />
      </div>
    </section>
  )
}

function Field({ children, error, label }: { children: ReactNode; error?: string; label: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {error ? <span className="mt-1.5 block text-sm text-danger">{error}</span> : null}
    </label>
  )
}
