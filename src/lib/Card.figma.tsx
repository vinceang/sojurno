import figma from '@figma/code-connect'
import { Card } from './Card'

const URL = 'https://www.figma.com/design/A3mcfYDq5wZ7As46yri9jO/Sojurno-Design-System?node-id=11-21'

figma.connect(Card, URL, {
  props: {
    padding: figma.enum('Padding', {
      none: 'none',
      md: 'md',
      lg: 'lg',
    }),
    elevation: figma.enum('Elevation', {
      none: 'none',
      sm: 'sm',
      lg: 'lg',
    }),
  },
  example: ({ elevation, padding }) => (
    <Card elevation={elevation} padding={padding}>
      Card content
    </Card>
  ),
})
