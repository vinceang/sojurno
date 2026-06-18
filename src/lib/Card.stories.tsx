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

export const Padding: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      <Card className="w-44" padding="none">
        <p className="p-3 text-sm font-semibold">padding none</p>
      </Card>
      <Card className="w-44" padding="md">
        <p className="text-sm font-semibold">padding md</p>
      </Card>
      <Card className="w-44" padding="lg">
        <p className="text-sm font-semibold">padding lg</p>
      </Card>
    </div>
  ),
}

export const Elevation: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      <Card className="w-44" elevation="none">
        <p className="text-sm font-semibold">elevation none</p>
      </Card>
      <Card className="w-44" elevation="sm">
        <p className="text-sm font-semibold">elevation sm</p>
      </Card>
      <Card className="w-44" elevation="lg">
        <p className="text-sm font-semibold">elevation lg</p>
      </Card>
    </div>
  ),
}
