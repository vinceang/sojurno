import { type FormEvent, type ReactNode, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useListings } from '../components/useListings'
import { useToast } from '../components/useToast'
import { Button } from '../lib/Button'
import { Input } from '../lib/Input'
import { SectionHeader } from '../lib/SectionHeader'
import type { ListingInput } from '../components/listings-context'
import { useI18n } from '../i18n/useI18n'
import { useSession } from '../session/useSession'
import { useTenant } from '../tenants/useTenant'

const splitList = (value: string) => value.split(',').map((s) => s.trim()).filter(Boolean)

/**
 * Add / edit a listing (→ ADR-0026 Phase 3). Writes live to Supabase via `useListings`, with an
 * image upload to Storage. Auth-gated; only the signed-in account's own listings are editable.
 */
export function ListingFormPage() {
  const { listingId } = useParams()
  const { tenant, tenantId } = useTenant()
  const { t } = useI18n()
  const { authenticated } = useSession()
  const { create, get, update, userListings } = useListings()
  const { toast } = useToast()
  const navigate = useNavigate()

  const editing = Boolean(listingId)
  const existing = useMemo(() => (listingId ? get(listingId) : undefined), [get, listingId])
  // Only the signed-in account's own (source='user') listings are editable.
  const ownsExisting = listingId ? userListings.some((l) => l.id === listingId) : true

  const [title, setTitle] = useState(existing?.title ?? '')
  const [location, setLocation] = useState(existing?.location ?? '')
  const [neighborhood, setNeighborhood] = useState(existing?.neighborhood ?? '')
  const [price, setPrice] = useState(existing ? String(existing.price) : '')
  const [highlight, setHighlight] = useState(existing?.highlight ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [tags, setTags] = useState(existing?.tags.join(', ') ?? '')
  const [amenities, setAmenities] = useState(existing?.amenities.join(', ') ?? '')
  const [imageFile, setImageFile] = useState<File | undefined>()
  const [preview, setPreview] = useState(existing?.images[0]?.src)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [pending, setPending] = useState(false)

  if (!authenticated) return <Navigate replace to="/login" />
  // Can't edit the curated listings (not yours) — bounce to the read-only detail page.
  if (editing && (!existing || !ownsExisting)) return <Navigate replace to={`/t/${tenantId}/host/listings`} />

  function onPickImage(file?: File) {
    setImageFile(file)
    if (file) setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const priceNum = Number(price)
    const next: Record<string, boolean> = {
      title: title.trim() === '',
      location: location.trim() === '',
      neighborhood: neighborhood.trim() === '',
      price: !(priceNum > 0),
      highlight: highlight.trim() === '',
      description: description.trim() === '',
      image: !editing && !imageFile,
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return

    const input: ListingInput = {
      tenant: tenantId,
      title: title.trim(),
      location: location.trim(),
      neighborhood: neighborhood.trim(),
      price: priceNum,
      highlight: highlight.trim(),
      description: description.trim(),
      tags: splitList(tags),
      amenities: splitList(amenities),
      imageUrl: existing?.images[0]?.src,
      imageFile,
    }

    setPending(true)
    const result = editing && listingId ? await update(listingId, input) : await create(input)
    setPending(false)

    if (result) {
      toast({ title: t(editing ? 'listingForm.updatedToast' : 'listingForm.createdToast'), tone: 'success' })
      navigate(`/t/${tenantId}/stays/${result.id}`)
    } else {
      toast({ description: t('listingForm.errorBody'), title: t('listingForm.errorTitle'), tone: 'info' })
    }
  }

  return (
    <section className="sj-section">
      <div className="sj-container max-w-2xl">
        <SectionHeader
          as="h1"
          eyebrow={`${t('listingForm.eyebrow')} · ${tenant.name}`}
          eyebrowTone="accent"
          size="lg"
          title={t(editing ? 'listingForm.editTitle' : 'listingForm.newTitle')}
        />

        <form className="mt-10 space-y-5" noValidate onSubmit={handleSubmit}>
          <Field error={errors.title} label={t('listingForm.title')}>
            <Input onChange={(e) => setTitle(e.target.value)} placeholder={t('listingForm.titlePlaceholder')} value={title} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field error={errors.location} label={t('listingForm.location')}>
              <Input onChange={(e) => setLocation(e.target.value)} placeholder={t('listingForm.locationPlaceholder')} value={location} />
            </Field>
            <Field error={errors.neighborhood} label={t('listingForm.neighborhood')}>
              <Input onChange={(e) => setNeighborhood(e.target.value)} placeholder={t('listingForm.neighborhoodPlaceholder')} value={neighborhood} />
            </Field>
          </div>
          <Field error={errors.price} label={t('listingForm.price')}>
            <Input min="1" onChange={(e) => setPrice(e.target.value)} placeholder="180" type="number" value={price} />
          </Field>
          <Field error={errors.highlight} label={t('listingForm.highlight')}>
            <Input onChange={(e) => setHighlight(e.target.value)} placeholder={t('listingForm.highlightPlaceholder')} value={highlight} />
          </Field>
          <Field error={errors.description} label={t('listingForm.description')}>
            <textarea
              className="min-h-28 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-ring"
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('listingForm.descriptionPlaceholder')}
              value={description}
            />
          </Field>
          <Field label={`${t('listingForm.tags')} ${t('listingForm.commaHint')}`}>
            <Input onChange={(e) => setTags(e.target.value)} placeholder={t('listingForm.tagsPlaceholder')} value={tags} />
          </Field>
          <Field label={`${t('listingForm.amenities')} ${t('listingForm.commaHint')}`}>
            <Input onChange={(e) => setAmenities(e.target.value)} placeholder={t('listingForm.amenitiesPlaceholder')} value={amenities} />
          </Field>
          <Field error={errors.image} label={t('listingForm.image')}>
            {preview ? <img alt="" className="mb-3 h-40 w-full rounded-lg object-cover" src={preview} /> : null}
            <input
              accept="image/*"
              className="block w-full text-sm text-text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-muted file:px-4 file:py-2 file:text-sm file:font-semibold file:text-foreground hover:file:bg-muted/70"
              onChange={(e) => onPickImage(e.target.files?.[0])}
              type="file"
            />
          </Field>

          <div className="flex gap-3 pt-2">
            <Button className="flex-1" disabled={pending} size="lg" type="submit" variant="accent">
              {t(editing ? 'listingForm.submitEdit' : 'listingForm.submitNew')}
            </Button>
            <Button onClick={() => navigate(`/t/${tenantId}/host/listings`)} size="lg" type="button" variant="secondary">
              {t('listingForm.cancel')}
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}

function Field({ children, error, label }: { children: ReactNode; error?: boolean; label: string }) {
  const { t } = useI18n()
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {error ? <span className="mt-1.5 block text-sm text-danger">{t('listingForm.required')}</span> : null}
    </label>
  )
}
