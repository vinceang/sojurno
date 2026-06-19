import type { Meta, StoryObj } from '@storybook/react'
import { TENANTS } from '../tenants/tenants'
import { CommunityCard } from './CommunityCard'

const active = TENANTS.filter((tenant) => tenant.active)[0]
const upcoming = TENANTS.filter((tenant) => !tenant.active)[0]

const meta = {
  title: 'Product/CommunityCard',
  component: CommunityCard,
  parameters: {
    a11y: { test: 'error' },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CommunityCard>

export default meta
type Story = StoryObj<typeof meta>

export const Active: Story = {
  args: { tenant: active },
}

export const Upcoming: Story = {
  args: { tenant: upcoming },
}
