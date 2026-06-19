import type { Meta, StoryObj } from '@storybook/react'
import { SearchPanel } from './SearchPanel'

const meta = {
  title: 'Product/SearchPanel',
  component: SearchPanel,
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
} satisfies Meta<typeof SearchPanel>

export default meta
type Story = StoryObj<typeof meta>

/** The landing hero bar — stacks on mobile, single row at sm+. */
export const Bar: Story = {
  args: { showTenantSelect: true },
}

/** Inline pill row used in the Explore filter bar / header contexts. */
export const Compact: Story = {
  args: { compact: true },
}

/** The vertical card used in the two-column hero (mobile form-factor at any width). */
export const Stacked: Story = {
  args: { stacked: true, showTenantSelect: true },
  decorators: [
    (Story) => (
      <div className="max-w-sm p-8">
        <Story />
      </div>
    ),
  ],
}
