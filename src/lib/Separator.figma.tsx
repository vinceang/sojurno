import figma from '@figma/code-connect'
import { Separator } from './Separator'

const URL = 'https://www.figma.com/design/A3mcfYDq5wZ7As46yri9jO/Sojurno-Design-System?node-id=10-27'

figma.connect(Separator, URL, {
  props: {
    orientation: figma.enum('Orientation', {
      horizontal: 'horizontal',
      vertical: 'vertical',
    }),
  },
  example: ({ orientation }) => <Separator orientation={orientation} />,
})
