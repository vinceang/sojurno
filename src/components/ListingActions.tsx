import { Check, Heart, Link2, Mail, MessageCircle, Share2 } from 'lucide-react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../lib/Dialog'
import { cn } from '../lib/utils'
import { useI18n } from '../i18n/useI18n'
import type { Listing } from '../types'
import { useSavedListing } from './useSavedListing'

/**
 * Listing-header Share + Save actions (→ ADR-0023, no dead-end CTAs).
 * Share opens a real, client-side share dialog (copy link, email, WhatsApp, native share).
 * Save is a local heart toggle persisted to localStorage — shared with the card heart.
 */
export function ListingActions({ listing }: { listing: Listing }) {
  const { t } = useI18n()
  const [shareOpen, setShareOpen] = useState(false)
  const { saved, toggle } = useSavedListing(listing.id)

  return (
    <div className="flex shrink-0 items-center gap-1">
      <button className={actionClass} onClick={() => setShareOpen(true)} type="button">
        <Share2 aria-hidden="true" className="h-4 w-4" />
        <span className="sj-link">{t('listing.share')}</span>
      </button>
      <button aria-pressed={saved} className={actionClass} onClick={toggle} type="button">
        <Heart aria-hidden="true" className={cn('h-4 w-4', saved && 'fill-accent text-accent')} />
        <span className="sj-link">{saved ? t('listing.saved') : t('listing.save')}</span>
      </button>
      <ShareDialog listing={listing} onOpenChange={setShareOpen} open={shareOpen} />
    </div>
  )
}

const actionClass =
  'inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-foreground transition hover:bg-muted/60'

function ShareDialog({
  listing,
  onOpenChange,
  open,
}: {
  listing: Listing
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)

  const url = typeof window === 'undefined' ? '' : window.location.href
  const text = `${listing.title} · Sojurno`
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  const options: ShareOption[] = [
    { icon: copied ? Check : Link2, label: copied ? t('listing.shareCopied') : t('listing.shareCopy'), onClick: copyLink },
    { icon: Mail, label: t('listing.shareEmail'), href: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}` },
    { icon: MessageCircle, label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}` },
    ...(canNativeShare
      ? [{ icon: Share2, label: t('listing.shareMore'), onClick: () => void navigator.share({ text, title: listing.title, url }) }]
      : []),
  ]

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogTitle>{t('listing.shareTitle')}</DialogTitle>
        <DialogDescription className="sr-only">{listing.title}</DialogDescription>

        <div className="mt-4 flex items-center gap-3 rounded-xl bg-secondary p-3">
          {listing.images[0]?.src ? (
            <img alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" src={listing.images[0].src} />
          ) : null}
          <div className="min-w-0">
            <p className="truncate font-semibold">{listing.title}</p>
            <p className="truncate text-sm text-text-muted">
              ★ {listing.rating} · {listing.neighborhood}, {listing.location}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {options.map((option) => (
            <ShareRow key={option.label} option={option} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

type ShareOption = {
  icon: typeof Link2
  label: string
  href?: string
  onClick?: () => void
}

function ShareRow({ option: { href, icon: Icon, label, onClick } }: { option: ShareOption }) {
  const className =
    'flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted/60'
  const inner = (
    <>
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-text-muted" />
      {label}
    </>
  )
  return href ? (
    <a className={className} href={href} rel="noreferrer" target="_blank">
      {inner}
    </a>
  ) : (
    <button className={className} onClick={onClick} type="button">
      {inner}
    </button>
  )
}
