import { type FormEvent, type ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../lib/Button'
import { Input } from '../lib/Input'
import { useI18n } from '../i18n/useI18n'
import { useSession } from '../session/useSession'
import { DemoActionDialog } from './DemoActionDialog'
import { useDemoAction } from './useDemoAction'

/**
 * The shared login form (→ ADR-0024/0025): username + password with empty-field-only validation;
 * a valid submit signs in as the fixed Test User identity and calls `onSuccess`. Used by both the
 * `/login` page and the in-context `LoginDialog`. Header/wrapper is the caller's responsibility.
 */
export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const { t } = useI18n()
  const { login } = useSession()
  const forgot = useDemoAction()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ password?: boolean; username?: boolean }>({})

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = { password: password.trim() === '', username: username.trim() === '' }
    setErrors(next)
    if (next.username || next.password) return
    await login()
    onSuccess?.()
  }

  return (
    <>
      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
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

      <DemoActionDialog
        body={t('login.forgotBody')}
        onOpenChange={forgot.setOpen}
        open={forgot.open}
        title={t('login.forgotTitle')}
      />
    </>
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
