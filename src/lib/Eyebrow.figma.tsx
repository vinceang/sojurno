import figma from '@figma/code-connect'
import { Eyebrow } from './Eyebrow'

const URL = 'https://www.figma.com/design/A3mcfYDq5wZ7As46yri9jO/Sojurno-Design-System?node-id=10-23'

figma.connect(Eyebrow, URL, {
  props: {
    tone: figma.enum('Tone', {
      muted: 'muted',
      accent: 'accent',
    }),
  },
  example: ({ tone }) => <Eyebrow tone={tone}>Affinity-based stays</Eyebrow>,
})
