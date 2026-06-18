import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta = {
  title: 'Design System/Input',
  component: Input,
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    'aria-label': 'Location',
    placeholder: 'Where are you racing?',
  },
}
