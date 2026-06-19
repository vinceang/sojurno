import figma from '@figma/code-connect'
import { Rating } from './Rating'

const URL = 'https://www.figma.com/design/A3mcfYDq5wZ7As46yri9jO/Sojurno-Design-System?node-id=11-23'

figma.connect(Rating, URL, {
  example: () => <Rating count={84} rating={4.98} />,
})
