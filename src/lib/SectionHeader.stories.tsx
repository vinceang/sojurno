import type { Meta, StoryObj } from '@storybook/react'
import { SectionHeader } from './SectionHeader'

const meta = {
  title: 'Design System/SectionHeader',
  component: SectionHeader,
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof SectionHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Start: Story = {
  args: {
    eyebrow: 'Community directory',
    title: 'Find your community',
    subtitle: 'Each community is a distinct stays experience on the same shared Sojurno platform.',
  },
}

export const Centered: Story = {
  args: {
    align: 'center',
    size: 'xl',
    eyebrow: 'How Sojurno works',
    title: 'Belonging, not just booking',
  },
}
