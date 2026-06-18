import type { Meta, StoryObj } from '@storybook/react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select'

const meta = {
  title: 'Design System/Select',
  parameters: {
    a11y: { test: 'error' },
    layout: 'centered',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Select defaultValue="recent">
      <SelectTrigger aria-label="Sort listings" className="w-56">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="recent">Most recent</SelectItem>
        <SelectItem value="price">Price: low to high</SelectItem>
        <SelectItem value="rating">Top rated</SelectItem>
      </SelectContent>
    </Select>
  ),
}
