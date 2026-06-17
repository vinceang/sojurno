import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta = {
  title: 'Design System/Badge',
  component: Badge,
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Tones: Story = {
  args: {
    children: 'Badge',
  },
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge>Native</Badge>
      <Badge tone="accent">Runners</Badge>
      <Badge tone="outline">Booked externally</Badge>
    </div>
  ),
}
