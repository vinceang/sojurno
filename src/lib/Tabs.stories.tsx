import type { Meta, StoryObj } from '@storybook/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs'

const meta = {
  title: 'Design System/Tabs',
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tabs className="w-80" defaultValue="reservations">
      <TabsList>
        <TabsTrigger value="reservations">Reservations</TabsTrigger>
        <TabsTrigger value="requests">Requests</TabsTrigger>
      </TabsList>
      <TabsContent className="mt-4 text-sm text-text-muted" value="reservations">
        Upcoming reservations appear here.
      </TabsContent>
      <TabsContent className="mt-4 text-sm text-text-muted" value="requests">
        Pending requests appear here.
      </TabsContent>
    </Tabs>
  ),
}
