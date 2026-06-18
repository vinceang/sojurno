import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from './Checkbox'

const meta = {
  title: 'Design System/Checkbox',
  component: Checkbox,
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Checkbox defaultChecked id="gear" />
      <label className="text-sm font-semibold" htmlFor="gear">
        Include lent gear
      </label>
    </div>
  ),
}
