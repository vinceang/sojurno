import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'

const meta = {
  title: 'Design System/Card',
  component: Card,
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Elevations: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Card className="w-48">
        <p className="font-extrabold">Default</p>
        <p className="mt-1 text-sm text-text-muted">padding md · shadow sm</p>
      </Card>
      <Card className="w-48" elevation="lg" padding="lg">
        <p className="font-extrabold">Elevated</p>
        <p className="mt-1 text-sm text-text-muted">padding lg · shadow lg</p>
      </Card>
    </div>
  ),
}
