import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { ACTIVE_TENANTS } from '../tenants/tenants'
import { Brand } from './Brand'
import { CommunityPill } from './CommunityPill'

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="border-t border-border bg-card">
      <div className="sj-container grid gap-10 py-14 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <Brand />
          <p className="mt-4 max-w-sm text-sm leading-6 text-text-muted">{t('footer.tagline')}</p>
        </div>
        <FooterColumn
          links={[
            ['/communities', t('footer.communities')],
            ['/t/runners/explore', t('footer.exploreStays')],
            ['/t/runners/host', t('footer.startHosting')],
            ['/start', t('footer.createCommunity')],
          ]}
          title={t('footer.product')}
        />
        <FooterColumn
          links={[
            ['/about', t('footer.aboutUs')],
            ['/design', t('footer.designSystem')],
          ]}
          title={t('footer.about')}
        />
        <FooterColumn
          links={[
            ['/', t('footer.privacy')],
            ['/', t('footer.terms')],
            ['/', t('footer.accessibility')],
          ]}
          title={t('footer.legal')}
        />
      </div>
      <div className="sj-container border-t border-border py-6">
        <div className="flex flex-col gap-4 text-sm text-text-muted md:flex-row md:items-center md:justify-between">
          <span>{t('footer.copyright')}</span>
          <div className="flex flex-wrap gap-2">
            {ACTIVE_TENANTS.map((tenant) => (
              <CommunityPill id={tenant.id} key={tenant.id} label={tenant.name} />
            ))}
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-text-muted">{t('footer.moreComing')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ links, title }: { links: [string, string][]; title: string }) {
  return (
    <div>
      <h2 className="text-xs font-extrabold uppercase tracking-[0.22em] text-text-muted">{title}</h2>
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
