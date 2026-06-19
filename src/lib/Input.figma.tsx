import figma from '@figma/code-connect'
import { Input } from './Input'

const URL = 'https://www.figma.com/design/A3mcfYDq5wZ7As46yri9jO/Sojurno-Design-System?node-id=10-29'

figma.connect(Input, URL, {
  example: () => <Input placeholder="Where are you going?" />,
})
