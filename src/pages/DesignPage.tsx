import { ArrowUpRight } from 'lucide-react'
import { Button } from '../lib/Button'
import { useI18n } from '../i18n/useI18n'

export function DesignPage() {
  const { t } = useI18n()

  return (
    <section className="sj-section">
      <div className="sj-container max-w-3xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-accent">Builder tools</p>
        <h1 className="sj-display mt-4 text-6xl leading-none">{t('design.title')}</h1>
        <p className="mt-5 text-lg leading-8 text-text-muted">{t('design.body')}</p>
        <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-extrabold">Storybook is the canonical documentation surface.</h2>
          <p className="mt-3 text-sm leading-6 text-text-muted">
            The in-app page stays intentionally thin so product navigation remains focused on travelers and hosts.
          </p>
          <Button asChild className="mt-5" variant="accent">
            <a href="http://localhost:6006" rel="noreferrer" target="_blank">
              {t('design.open')} <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
