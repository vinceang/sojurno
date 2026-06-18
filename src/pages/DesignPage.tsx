import { ArrowUpRight } from 'lucide-react'
import { Button } from '../lib/Button'
import { SectionHeader } from '../lib/SectionHeader'
import { STORYBOOK_URL } from '../config'
import { useI18n } from '../i18n/useI18n'

export function DesignPage() {
  const { t } = useI18n()

  return (
    <section className="sj-section">
      <div className="sj-container max-w-3xl">
        <SectionHeader
          as="h1"
          eyebrow="Builder tools"
          eyebrowTone="accent"
          size="xl"
          subtitle={t('design.body')}
          title={t('design.title')}
        />
        <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-extrabold">Storybook is the canonical documentation surface.</h2>
          <p className="mt-3 text-sm leading-6 text-text-muted">
            The in-app page stays intentionally thin so product navigation remains focused on travelers and hosts.
          </p>
          <Button asChild className="mt-5" variant="accent">
            <a href={STORYBOOK_URL} rel="noreferrer" target="_blank">
              {t('design.open')} <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
