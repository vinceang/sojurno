import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { DemoActionDialog } from '../components/DemoActionDialog'
import { useDemoAction } from '../components/useDemoAction'
import { Button } from '../lib/Button'
import { SectionHeader } from '../lib/SectionHeader'
import { useI18n } from '../i18n/useI18n'

export function StartPage() {
  const { t } = useI18n()
  const create = useDemoAction()

  return (
    <section className="sj-section">
      <div className="sj-container grid gap-10 lg:grid-cols-[0.9fr_1fr]">
        <div>
          <SectionHeader
            as="h1"
            eyebrow={t('start.eyebrow')}
            eyebrowTone="accent"
            size="xl"
            subtitle={t('start.body')}
            title={t('start.title')}
          />
          <Button className="mt-8" onClick={create.trigger} size="lg" variant="accent">
            {t('start.cta')} <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Button>
          <DemoActionDialog
            body={t('start.demoBody')}
            onOpenChange={create.setOpen}
            open={create.open}
            title={t('start.demoTitle')}
          />
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-md">
          {['Community brand', 'Vocabulary and taxonomy', 'Trust signals', 'Capability modules'].map((item) => (
            <div className="flex gap-4 border-b border-border py-5 last:border-0" key={item}>
              <CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 text-accent" />
              <div>
                <h2 className="font-extrabold">{item}</h2>
                <p className="mt-1 text-sm leading-6 text-text-muted">
                  Sojurno treats this as tenant configuration, preserving one shared engine and a coherent design system.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
