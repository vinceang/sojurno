import type { Meta, StoryObj } from '@storybook/react'
import { getCollectionsByTenant } from '../data/collections'
import { CollectionCard } from './CollectionCard'

const runnerEvents = getCollectionsByTenant('runners')
const hikerPlaces = getCollectionsByTenant('hikers')

const meta = {
  title: 'Product/CollectionCard',
  component: CollectionCard,
  parameters: {
    a11y: { test: 'error' },
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CollectionCard>

export default meta
type Story = StoryObj<typeof meta>

export const Event: Story = {
  args: { collection: runnerEvents[0] },
}

export const Place: Story = {
  args: { collection: hikerPlaces[0] },
}
