import type { Meta, StoryObj } from '@storybook/react'
import { getCollectionsByTenant } from '../data/collections'
import { CollectionRail } from './CollectionRail'

const meta = {
  title: 'Product/CollectionRail',
  component: CollectionRail,
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
} satisfies Meta<typeof CollectionRail>

export default meta
type Story = StoryObj<typeof meta>

export const Races: Story = {
  args: {
    collections: getCollectionsByTenant('runners'),
    label: 'Upcoming races',
  },
}

export const Places: Story = {
  args: {
    collections: getCollectionsByTenant('hikers'),
    label: 'Trails & parks',
  },
}
