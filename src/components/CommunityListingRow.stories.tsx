import type { Meta, StoryObj } from '@storybook/react'
import { getListingsByTenant } from '../data/listings'
import { TENANTS } from '../tenants/tenants'
import { CommunityListingRow } from './CommunityListingRow'

const runners = TENANTS.filter((tenant) => tenant.active)[0]

const meta = {
  title: 'Product/CommunityListingRow',
  component: CommunityListingRow,
  parameters: {
    a11y: { test: 'error' },
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CommunityListingRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    eyebrow: 'Runners community',
    title: 'Race-ready stays, in cities you are running',
    tenant: runners,
    listings: getListingsByTenant('runners'),
    viewAllLabel: 'View all',
    prevLabel: 'Previous listings',
    nextLabel: 'Next listings',
  },
}
