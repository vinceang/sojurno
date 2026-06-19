import figma from '@figma/code-connect'
import { Button } from './Button'

const URL = 'https://www.figma.com/design/A3mcfYDq5wZ7As46yri9jO/Sojurno-Design-System?node-id=8-27'

figma.connect(Button, URL, {
  props: {
    variant: figma.enum('Variant', {
      primary: 'primary',
      accent: 'accent',
      secondary: 'secondary',
      ghost: 'ghost',
    }),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
  },
  example: ({ size, variant }) => (
    <Button size={size} variant={variant}>
      Button
    </Button>
  ),
})
