import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../lib/Dialog'
import { useI18n } from '../i18n/useI18n'
import { LoginForm } from './LoginForm'

/**
 * In-context login modal (→ ADR-0025). Opened by the save-gate so the user stays on the listing or
 * gallery rather than being sent to the `/login` page. Wraps the shared `LoginForm`; on a successful
 * sign-in it calls `onSuccess` (the save flow completes the pending save and closes the modal).
 */
export function LoginDialog({
  onOpenChange,
  onSuccess,
  open,
}: {
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  open: boolean
}) {
  const { t } = useI18n()

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogTitle>{t('save.loginTitle')}</DialogTitle>
        <DialogDescription>{t('save.loginPrompt')}</DialogDescription>
        <div className="mt-6">
          <LoginForm onSuccess={onSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
