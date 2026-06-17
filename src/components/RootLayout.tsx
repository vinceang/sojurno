import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { getActiveTenant } from '../tenants/tenants'
import { Footer } from './Footer'
import { Header } from './Header'

export function RootLayout() {
  const { t } = useI18n()
  const location = useLocation()
  const tenantId = location.pathname.split('/')[2]
  const tenant = location.pathname.startsWith('/t/') ? getActiveTenant(tenantId) : undefined

  useEffect(() => {
    if (!tenant) {
      delete document.documentElement.dataset.tenant
    }
  }, [tenant])

  return (
    <div className="sj-root">
      <a className="sj-skip-link" href="#main">
        {t('app.skip')}
      </a>
      <Header tenant={tenant} />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
