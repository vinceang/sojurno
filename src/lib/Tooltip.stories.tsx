import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip'

const meta = {
  title: 'Design System/Tooltip',
  parameters: {
    a11y: { test: 'error' },
    layout: 'centered',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="secondary">Trust signals</Button>
        </TooltipTrigger>
        <TooltipContent>Verified race history</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}
