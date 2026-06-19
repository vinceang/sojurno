import figma from '@figma/code-connect'
import { SectionHeader } from './SectionHeader'

const URL = 'https://www.figma.com/design/A3mcfYDq5wZ7As46yri9jO/Sojurno-Design-System?node-id=11-52'

figma.connect(SectionHeader, URL, {
  props: {
    size: figma.enum('Size', {
      md: 'md',
      lg: 'lg',
      xl: 'xl',
    }),
  },
  example: ({ size }) => (
    <SectionHeader
      eyebrow="Community directory"
      size={size}
      subtitle="Each community is a distinct stays experience on the same shared Sojurno platform."
      title="Find your community"
    />
  ),
})
