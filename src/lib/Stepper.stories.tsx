import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Stepper } from './Stepper'

const meta = {
  title: 'Design System/Stepper',
  component: Stepper,
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof Stepper>

export default meta
type Story = StoryObj<typeof meta>

function InteractiveStepper() {
  const [value, setValue] = useState(1)
  return <Stepper label="Sleeping bags" max={5} min={0} onChange={setValue} value={value} />
}

export const Interactive: Story = {
  args: { label: 'Sleeping bags', value: 1, onChange: () => undefined },
  render: () => <InteractiveStepper />,
}
