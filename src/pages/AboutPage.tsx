import { BookOpen, ChevronRight, Globe, Layers, Settings } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Eyebrow } from '../lib/Eyebrow'
import { useI18n } from '../i18n/useI18n'
import type { MessageKey } from '../i18n/messages'

// Drop a photo at public/maker.jpg to use it; falls back to a neutral portrait.
const portraitUrl = '/maker.jpg'
const portraitFallback =
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80'

type DisciplineCard = {
  title: MessageKey
  body: MessageKey
  tags: MessageKey[]
}

type ResourceCard = {
  title: MessageKey
  body: MessageKey
  meta: MessageKey
  icon: LucideIcon
}

const disciplines: DisciplineCard[] = [
  {
    title: 'about.uxTitle',
    body: 'about.uxBody',
    tags: ['about.tagInteraction', 'about.tagSystems', 'about.tagResearch', 'about.tagFigma'],
  },
  {
    title: 'about.engineeringTitle',
    body: 'about.engineeringBody',
    tags: ['about.tagReact', 'about.tagTailwind', 'about.tagA11y', 'about.tagTokens'],
  },
  {
    title: 'about.marketplaceTitle',
    body: 'about.marketplaceBody',
    tags: ['about.tagTrust', 'about.tagTenant', 'about.tagAffinity', 'about.tagBooking'],
  },
  {
    title: 'about.productTitle',
    body: 'about.productBody',
    tags: ['about.tagStrategy', 'about.tagPositioning', 'about.tagBrand', 'about.tagLaunch'],
  },
]

const resources: ResourceCard[] = [
  {
    title: 'about.storybookTitle',
    body: 'about.storybookBody',
    meta: 'about.storybookMeta',
    icon: Layers,
  },
  {
    title: 'about.tokensTitle',
    body: 'about.tokensBody',
    meta: 'about.tokensMeta',
    icon: Settings,
  },
  {
    title: 'about.figmaTitle',
    body: 'about.figmaBody',
    meta: 'about.figmaMeta',
    icon: Globe,
  },
  {
    title: 'about.themingTitle',
    body: 'about.themingBody',
    meta: 'about.themingMeta',
    icon: BookOpen,
  },
]

export function AboutPage() {
  const { t } = useI18n()

  return (
    <section className="sj-section">
      <div className="sj-container max-w-6xl">
        <header className="grid gap-8 border-b border-border pb-16 md:grid-cols-[8rem_1fr]">
          <img
            alt={t('about.portraitAlt')}
            className="h-24 w-24 rounded-3xl object-cover md:h-32 md:w-32"
            height="128"
            onError={(event) => {
              if (event.currentTarget.src !== portraitFallback) event.currentTarget.src = portraitFallback
            }}
            src={portraitUrl}
            width="128"
          />
          <div>
            <Eyebrow>{t('about.eyebrow')}</Eyebrow>
            <h1 className="sj-display mt-4 text-5xl leading-none md:text-6xl">{t('about.heading')}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-text-muted">{t('about.bio')}</p>
          </div>
        </header>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {disciplines.map((card) => (
            <article className="rounded-xl border border-border bg-card p-8" key={card.title}>
              <h2 className="text-2xl font-extrabold tracking-tight">{t(card.title)}</h2>
              <p className="mt-4 text-base leading-7 text-text-muted">{t(card.body)}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {card.tags.map((tag) => (
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-text-muted" key={tag}>
                    {t(tag)}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <aside className="mt-16 rounded-xl border border-dashed border-border bg-background p-8">
          <p className="max-w-4xl text-sm leading-6 text-text-muted">{t('about.launchNote')}</p>
        </aside>

        <section className="mt-20">
          <div className="flex items-center gap-6">
            <span className="h-px flex-1 bg-border" />
            <h2 className="text-xs font-extrabold uppercase tracking-[0.22em] text-text-muted">{t('about.resourcesTitle')}</h2>
            <span className="h-px flex-1 bg-border" />
          </div>
          <p className="mt-8 text-center text-base leading-7 text-text-muted">{t('about.resourcesBody')}</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {resources.map((resource) => {
              const Icon = resource.icon
              return (
                <Link
                  className="grid grid-cols-[3rem_1fr] gap-5 rounded-xl border border-border bg-card p-7 transition hover:-translate-y-0.5 hover:shadow-lg"
                  key={resource.title}
                  to="/design"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-text-muted">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xl font-extrabold tracking-tight">{t(resource.title)}</span>
                    <span className="mt-2 block text-sm leading-6 text-text-muted">{t(resource.body)}</span>
                    <span className="mt-4 block font-mono text-xs tracking-[0.18em] text-text-muted">{t(resource.meta)}</span>
                  </span>
                </Link>
              )
            })}
          </div>
          <div className="mt-10 text-center">
            <Link className="inline-flex items-center gap-2 text-sm font-bold text-text-muted hover:text-foreground" to="/design">
              {t('about.openSystem')}
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </section>
  )
}
