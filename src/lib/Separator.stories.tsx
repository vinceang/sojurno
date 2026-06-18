import type { Meta, StoryObj } from '@storybook/react'
import { Separator } from './Separator'

const meta = {
  title: 'Design System/Separator',
  component: Separator,
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <div className="w-64">
      <p className="text-sm font-semibold">Service fee</p>
      <Separator className="my-3" />
      <p className="text-sm font-semibold">Total</p>
    </div>
  ),
}
