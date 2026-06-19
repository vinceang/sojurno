import figma from '@figma/code-connect'
import { Badge } from './Badge'

const URL = 'https://www.figma.com/design/A3mcfYDq5wZ7As46yri9jO/Sojurno-Design-System?node-id=10-9'

figma.connect(Badge, URL, {
  props: {
    tone: figma.enum('Tone', {
      neutral: 'neutral',
      accent: 'accent',
      outline: 'outline',
    }),
  },
  example: ({ tone }) => <Badge tone={tone}>Badge</Badge>,
})
