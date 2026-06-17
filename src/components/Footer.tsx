import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { ACTIVE_TENANTS } from '../tenants/tenants'
import { Brand } from './Brand'
import { CommunityPill } from './CommunityPill'

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="border-t border-border bg-card">
      <div className="sj-container grid gap-10 py-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Brand />
          <p className="mt-4 max-w-sm text-sm leading-6 text-text-muted">{t('footer.tagline')}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {ACTIVE_TENANTS.map((tenant) => (
              <CommunityPill id={tenant.id} key={tenant.id} label={tenant.name} />
            ))}
            <span className="rounded-full border border-border px-3 py-1 text-xs font-bold text-text-muted">+ more coming</span>
          </div>
        </div>
        <FooterColumn
          links={[
            ['/communities', t('nav.communities')],
            ['/start', t('nav.start')],
          ]}
          title={t('footer.product')}
        />
        <FooterColumn links={[['/design', t('nav.design')]]} title={t('footer.builder')} />
        <FooterColumn
          links={[
            ['/', t('footer.privacy')],
            ['/', t('footer.terms')],
          ]}
          title={t('footer.legal')}
        />
      </div>
    </footer>
  )
}

function FooterColumn({ links, title }: { links: [string, string][]; title: string }) {
  return (
    <div>
      <h2 className="text-sm font-bold">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm text-text-muted">
        {links.map(([href, label]) => (
          <li key={`${href}-${label}`}>
            <Link className="hover:text-foreground" to={href}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
