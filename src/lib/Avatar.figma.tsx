import figma from '@figma/code-connect'
import { Avatar } from './Avatar'

const URL = 'https://www.figma.com/design/A3mcfYDq5wZ7As46yri9jO/Sojurno-Design-System?node-id=10-17'

figma.connect(Avatar, URL, {
  props: {
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
  },
  example: ({ size }) => <Avatar label="VA" size={size} />,
})
