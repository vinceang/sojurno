import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Calendar } from './Calendar'

const meta = {
  title: 'Design System/Calendar',
  component: Calendar,
  parameters: {
    a11y: { test: 'error' },
    layout: 'centered',
  },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

function RangeExample() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2026, 6, 18),
    to: new Date(2026, 6, 21),
  })
  return <Calendar mode="range" numberOfMonths={1} onSelect={setRange} selected={range} />
}

export const Range: Story = {
  render: () => <RangeExample />,
}
