import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'

const meta = {
  title: 'Design System/Avatar',
  component: Avatar,
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Sizes: Story = {
  args: { label: 'A' },
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar label="SM" size="sm" />
      <Avatar label="MD" size="md" />
      <Avatar label="LG" size="lg" />
    </div>
  ),
}

export const WithImage: Story = {
  args: {
    label: 'VA',
    alt: 'Vincent Ang',
    src: 'https://i.pravatar.cc/112?img=12',
    size: 'lg',
  },
}
