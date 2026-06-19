import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../lib/Button'
import { SectionHeader } from '../lib/SectionHeader'
import { useI18n } from '../i18n/useI18n'
import { useSession } from '../session/useSession'
import { DEFAULT_TENANT } from '../tenants/tenants'

export function LoginPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { account, login } = useSession()

  function handleLogin() {
    login()
    navigate(`/t/${DEFAULT_TENANT}/host`)
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

        {account ? (
          <div className="mt-10 space-y-4">
            <p className="text-sm text-text-muted">
              {t('login.eyebrow')}, <span className="font-semibold text-foreground">{account.name}</span>.
            </p>
            <Button className="w-full" onClick={handleLogin} size="lg" variant="accent">
              {t('login.submit')}
            </Button>
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            <p className="text-sm text-text-muted">{t('login.noAccount')}</p>
            <Button asChild className="w-full" size="lg" variant="accent">
              <Link to="/become-a-host">{t('login.becomeHost')}</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
