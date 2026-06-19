import figma from '@figma/code-connect'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs'

const URL = 'https://www.figma.com/design/A3mcfYDq5wZ7As46yri9jO/Sojurno-Design-System?node-id=11-75'

figma.connect(Tabs, URL, {
  props: {
    defaultValue: figma.enum('Active', {
      reservations: 'reservations',
      requests: 'requests',
    }),
  },
  example: ({ defaultValue }) => (
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        <TabsTrigger value="reservations">Reservations</TabsTrigger>
        <TabsTrigger value="requests">Requests</TabsTrigger>
      </TabsList>
      <TabsContent value="reservations">Upcoming reservations</TabsContent>
      <TabsContent value="requests">Pending requests</TabsContent>
    </Tabs>
  ),
})
