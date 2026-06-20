import type { Meta, StoryObj } from '@storybook/react'
import { Check, Info, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from './Button'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProviderPrimitive,
  ToastTitle,
  ToastViewport,
} from './Toast'

const meta = {
  title: 'Design System/Toast',
  parameters: {
    a11y: { test: 'error' },
    layout: 'centered',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function Demo({ description, title, tone }: { description?: string; title: string; tone?: 'default' | 'success' | 'info' }) {
  const [open, setOpen] = useState(false)
  const [key, setKey] = useState(0)
  const Icon = tone === 'success' ? Check : tone === 'info' ? Info : null

  return (
    <ToastProviderPrimitive duration={4000}>
      <Button
        onClick={() => {
          setKey((k) => k + 1)
          setOpen(true)
        }}
      >
        Show toast
      </Button>
      <Toast key={key} onOpenChange={setOpen} open={open} tone={tone}>
        {Icon ? (
          <Icon aria-hidden="true" className={tone === 'success' ? 'mt-0.5 h-4 w-4 shrink-0 text-accent' : 'mt-0.5 h-4 w-4 shrink-0 text-text-muted'} />
        ) : null}
        <div className="min-w-0 flex-1">
          <ToastTitle>{title}</ToastTitle>
          {description ? <ToastDescription>{description}</ToastDescription> : null}
        </div>
        <ToastClose aria-label="Dismiss">
          <X aria-hidden="true" className="h-4 w-4" />
        </ToastClose>
      </Toast>
      <ToastViewport />
    </ToastProviderPrimitive>
  )
}

export const Success: Story = {
  render: () => <Demo title="Saved" tone="success" />,
}

export const Info_: Story = {
  name: 'Info',
  render: () => <Demo description="Sample content for a product demo — not a real legal agreement." title="Sample content" tone="info" />,
}

export const Default: Story = {
  render: () => <Demo description="A neutral notification with a short supporting line." title="Heads up" />,
}
