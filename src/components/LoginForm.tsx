import { type FormEvent, type ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../lib/Button'
import { Input } from '../lib/Input'
import { DEMO_EMAIL, DEMO_PASSWORD } from '../lib/supabase'
import { useI18n } from '../i18n/useI18n'
import { useSession } from '../session/useSession'
import { DemoActionDialog } from './DemoActionDialog'
import { useDemoAction } from './useDemoAction'

/**
 * The shared login form (→ ADR-0024/0026): a real email/password sign-in against the demo Supabase
 * account. Empty fields are rejected inline; wrong credentials surface an error. On success it calls
 * `onSuccess`. The demo-credentials note appears here so both the `/login` page and the save-gate
 * `LoginDialog` show it.
 */
export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const { t } = useI18n()
  const { signIn } = useSession()
  const forgot = useDemoAction()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ password?: boolean; email?: boolean }>({})
  const [failed, setFailed] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = { password: password.trim() === '', email: email.trim() === '' }
    setErrors(next)
    setFailed(false)
    if (next.email || next.password) return
    setPending(true)
    const ok = await signIn(email.trim(), password)
    setPending(false)
    if (ok) onSuccess?.()
    else setFailed(true)
  }

  function useDemoAccount() {
    setEmail(DEMO_EMAIL)
    setPassword(DEMO_PASSWORD)
    setErrors({})
    setFailed(false)
  }

  return (
    <>
      <div className="mb-6 rounded-xl bg-accent-soft p-4 text-sm leading-relaxed text-accent">
        <p>{t('login.demoNote')}</p>
        <p className="mt-1.5 font-semibold">
          {DEMO_EMAIL} · {DEMO_PASSWORD}
        </p>
        <button className="sj-link mt-2 inline-block font-bold" onClick={useDemoAccount} type="button">
          {t('login.useDemoAccount')} →
        </button>
      </div>

      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        <Field error={errors.email ? t('login.errorEmail') : undefined} label={t('login.email')}>
          <Input
            aria-invalid={errors.email || undefined}
            autoComplete="email"
            className={errors.email ? 'border-danger' : undefined}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t('login.emailPlaceholder')}
            type="email"
            value={email}
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
        {failed ? <p className="text-sm text-danger">{t('login.invalid')}</p> : null}
        <div className="flex justify-end">
          <button
            className="sj-link text-sm font-semibold text-text-muted hover:text-foreground"
            onClick={forgot.trigger}
            type="button"
          >
            {t('login.forgot')}
          </button>
        </div>
        <Button className="w-full" disabled={pending} size="lg" type="submit" variant="accent">
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
