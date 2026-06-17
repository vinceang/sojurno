import type { Meta, StoryObj } from '@storybook/react'
import { Rating } from './Rating'

const meta = {
  title: 'Design System/Rating',
  component: Rating,
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof Rating>

export default meta
type Story = StoryObj<typeof meta>

export const WithReviewCount: Story = {
  args: {
    rating: 4.97,
    count: 128,
  },
}

export const RatingOnly: Story = {
  args: {
    rating: 5,
  },
}
