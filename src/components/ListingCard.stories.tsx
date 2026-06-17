import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { LISTINGS } from '../data/listings'
import { ListingCard } from './ListingCard'

const meta = {
  title: 'Product/ListingCard',
  component: ListingCard,
  parameters: {
    a11y: { test: 'error' },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="max-w-sm">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof ListingCard>

export default meta
type Story = StoryObj<typeof meta>

export const Native: Story = {
  args: {
    listing: LISTINGS[0],
  },
}

export const External: Story = {
  args: {
    listing: LISTINGS[1],
  },
}
