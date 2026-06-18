import type { Meta, StoryObj } from '@storybook/react'
import { Switch } from './Switch'

const meta = {
  title: 'Design System/Switch',
  component: Switch,
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Switch defaultChecked id="gear-lending" />
      <label className="text-sm font-semibold" htmlFor="gear-lending">
        Offer gear lending
      </label>
    </div>
  ),
}
