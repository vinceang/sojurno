import { Fragment, useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Eyebrow } from '../lib/Eyebrow'
import { getLegalDoc, isLegalDocId } from '../data/legal'
import { useI18n } from '../i18n/useI18n'
import { useToast } from '../components/useToast'

/**
 * Long-form legal pages (Privacy / Terms / Accessibility) reached from the footer (→ ADR-0023).
 * Real content from `data/legal.ts` in the active locale (EN fallback), rendered in the shared
 * `.sj-prose` reading layout. Unknown `:docId`s redirect home. The "sample content" disclaimer
 * surfaces as a toast on entry rather than an inline banner (→ ADR-0025).
 */
export function LegalPage() {
  const { docId } = useParams()
  const { locale, t } = useI18n()
  const { toast } = useToast()
  const valid = isLegalDocId(docId)

  useEffect(() => {
    if (valid) toast({ description: t('legal.disclaimer'), title: t('legal.disclaimerTitle'), tone: 'info' })
  }, [docId, valid, t, toast])

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
