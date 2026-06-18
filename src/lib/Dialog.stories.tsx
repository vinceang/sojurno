import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from './Dialog'

const meta = {
  title: 'Design System/Dialog',
  parameters: {
    a11y: { test: 'error' },
    layout: 'centered',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Request to book</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Confirm your request</DialogTitle>
        <DialogDescription>Send your stay request to the host for review?</DialogDescription>
        <div className="mt-5 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button variant="accent">Send request</Button>
        </div>
      </DialogContent>
    </Dialog>
  ),
}
