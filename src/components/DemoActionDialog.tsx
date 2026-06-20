import { Button } from '../lib/Button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '../lib/Dialog'
import { useI18n } from '../i18n/useI18n'

/**
 * Reusable demo-mode affordance (→ ADR-0023). For CTAs whose real action has no backend yet:
 * states plainly that this is a demo and what would happen. Generalizes the inline dialog
 * ADR-0021 introduced for "Become a host".
 *
 * Two modes:
 * - **Acknowledge** (default): a single dismiss button. The action conceptually already
 *   "happened" (e.g. Reserve → "Request sent").
 * - **Confirm** (pass `onConfirm`): Cancel + Confirm, where Confirm runs the real follow-up
 *   (e.g. onboarding creating the mock session).
 */
type DemoActionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  body: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
}

export function DemoActionDialog({
  body,
  cancelLabel,
  confirmLabel,
  onConfirm,
  onOpenChange,
  open,
  title,
}: DemoActionDialogProps) {
  const { t } = useI18n()

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{body}</DialogDescription>
        <div className="mt-5 flex justify-end gap-2">
          {onConfirm ? (
            <>
              <DialogClose asChild>
                <Button variant="secondary">{cancelLabel ?? t('demo.cancel')}</Button>
              </DialogClose>
              <Button onClick={onConfirm} variant="accent">
                {confirmLabel ?? t('demo.confirm')}
              </Button>
            </>
          ) : (
            <DialogClose asChild>
              <Button variant="accent">{confirmLabel ?? t('demo.gotIt')}</Button>
            </DialogClose>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
