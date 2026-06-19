import { Fragment } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Eyebrow } from '../lib/Eyebrow'
import { getLegalDoc, isLegalDocId } from '../data/legal'
import { useI18n } from '../i18n/useI18n'

/**
 * Long-form legal pages (Privacy / Terms / Accessibility) reached from the footer (→ ADR-0023).
 * Real content from `data/legal.ts` in the active locale (EN fallback), rendered in the shared
 * `.sj-prose` reading layout. Unknown `:docId`s redirect home.
 */
export function LegalPage() {
  const { docId } = useParams()
  const { locale, t } = useI18n()

  if (!isLegalDocId(docId)) {
    return <Navigate replace to="/" />
  }

  const doc = getLegalDoc(locale, docId)

  return (
    <section className="sj-section">
      <div className="sj-container">
        <Eyebrow tone="accent">{t('legal.eyebrow')}</Eyebrow>
        <h1 className="sj-display mt-3 text-4xl leading-tight md:text-5xl">{doc.title}</h1>
        <p className="mt-3 text-sm text-text-muted">
          {t('legal.updatedLabel')}: {doc.updated}
        </p>
        <p className="mt-6 max-w-[68ch] rounded-xl bg-accent-soft p-4 text-sm leading-relaxed text-accent">
          {t('legal.disclaimer')}
        </p>

        <div className="sj-prose mt-10">
          <p>{doc.intro}</p>
          {doc.sections.map((section) => (
            <Fragment key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </Fragment>
          ))}
        </div>

        <p className="mt-12">
          <Link className="text-sm font-bold text-text-muted hover:text-foreground" to="/">
            ← {t('legal.backHome')}
          </Link>
        </p>
      </div>
    </section>
  )
}
