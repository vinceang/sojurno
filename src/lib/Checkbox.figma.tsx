import figma from '@figma/code-connect'
import { Checkbox } from './Checkbox'

const URL = 'https://www.figma.com/design/A3mcfYDq5wZ7As46yri9jO/Sojurno-Design-System?node-id=11-57'

figma.connect(Checkbox, URL, {
  props: {
    checked: figma.enum('State', {
      unchecked: false,
      checked: true,
    }),
  },
  example: ({ checked }) => <Checkbox aria-label="Include gear" checked={checked} />,
})
