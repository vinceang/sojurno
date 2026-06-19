import figma from '@figma/code-connect'
import { Switch } from './Switch'

const URL = 'https://www.figma.com/design/A3mcfYDq5wZ7As46yri9jO/Sojurno-Design-System?node-id=11-63'

figma.connect(Switch, URL, {
  props: {
    checked: figma.enum('State', {
      off: false,
      on: true,
    }),
  },
  example: ({ checked }) => <Switch aria-label="Offer gear lending" checked={checked} />,
})
