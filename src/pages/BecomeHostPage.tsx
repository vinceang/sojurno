import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DemoActionDialog } from '../components/DemoActionDialog'
import { Button } from '../lib/Button'
import { Input } from '../lib/Input'
import { SectionHeader } from '../lib/SectionHeader'
import { useI18n } from '../i18n/useI18n'
import { useSession } from '../session/useSession'
import { DEFAULT_TENANT } from '../tenants/tenants'

export function BecomeHostPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { completeOnboarding } = useSession()
  const [name, setName] = useState('')
  const [photo, setPhoto] = useState('')
  const [blurb, setBlurb] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  // Zero validation by design (ADR-0021): a blank submit opens the demo modal.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setConfirmOpen(true)
  }

  function confirm() {
    completeOnboarding({
      name: name.trim() || 'New host',
      photo: photo.trim() || undefined,
      blurb: blurb.trim() || undefined,
    })
    setConfirmOpen(false)
    navigate(`/t/${DEFAULT_TENANT}/host`)
  }

  return (
    <section className="sj-section">
      <div className="sj-container max-w-xl">
        <SectionHeader
          as="h1"
          eyebrow={t('host.onboard.eyebrow')}
          eyebrowTone="accent"
          size="lg"
          subtitle={t('host.onboard.body')}
          title={t('host.onboard.title')}
        />

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <Field label={t('host.onboard.nameLabel')}>
            <Input
              onChange={(event) => setName(event.target.value)}
              placeholder={t('host.onboard.namePlaceholder')}
              value={name}
            />
          </Field>
          <Field label={t('host.onboard.photoLabel')}>
            <Input
              inputMode="url"
              onChange={(event) => setPhoto(event.target.value)}
              placeholder={t('host.onboard.photoPlaceholder')}
              value={photo}
            />
          </Field>
          <Field label={t('host.onboard.blurbLabel')}>
            <textarea
              className="min-h-24 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-ring"
              onChange={(event) => setBlurb(event.target.value)}
              placeholder={t('host.onboard.blurbPlaceholder')}
              value={blurb}
            />
          </Field>
          <Button className="w-full" size="lg" type="submit" variant="accent">
            {t('host.onboard.submit')}
          </Button>
        </form>

        <DemoActionDialog
          body={t('host.demo.body')}
          cancelLabel={t('host.demo.cancel')}
          confirmLabel={t('host.demo.confirm')}
          onConfirm={confirm}
          onOpenChange={setConfirmOpen}
          open={confirmOpen}
          title={t('host.demo.title')}
        />
      </div>
    </section>
  )
}

function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
    </label>
  )
}
