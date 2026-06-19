import figma from '@figma/code-connect'
import { Stepper } from './Stepper'

const URL = 'https://www.figma.com/design/A3mcfYDq5wZ7As46yri9jO/Sojurno-Design-System?node-id=11-28'

figma.connect(Stepper, URL, {
  example: () => <Stepper label="Nights" min={1} onChange={() => undefined} value={3} />,
})
