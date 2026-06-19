import type { Meta, StoryObj } from '@storybook/react'
import { LISTINGS } from '../data/listings'
import { ListingRow } from './ListingRow'

const meta = {
  title: 'Product/ListingRow',
  component: ListingRow,
  parameters: {
    a11y: { test: 'error' },
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListingRow>

export default meta
type Story = StoryObj<typeof meta>

export const Native: Story = {
  args: { listing: LISTINGS[0] },
}

export const External: Story = {
  args: { listing: LISTINGS[1] },
}

export const List: Story = {
  args: { listing: LISTINGS[0] },
  render: () => (
    <div>
      {LISTINGS.slice(0, 3).map((listing) => (
        <ListingRow key={listing.id} listing={listing} />
      ))}
    </div>
  ),
}
