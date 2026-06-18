import type { Meta, StoryObj } from '@storybook/react'
import { Eyebrow } from './Eyebrow'

const meta = {
  title: 'Design System/Eyebrow',
  component: Eyebrow,
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof Eyebrow>

export default meta
type Story = StoryObj<typeof meta>

export const Tones: Story = {
  args: { children: 'Affinity-based stays' },
  render: () => (
    <div className="space-y-3">
      <Eyebrow>Affinity-based stays</Eyebrow>
      <Eyebrow tone="accent">Runners community</Eyebrow>
    </div>
  ),
}
