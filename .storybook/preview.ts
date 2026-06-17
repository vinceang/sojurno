import type { Preview } from '@storybook/react'
import '../src/styles/tailwind.css'
import '../src/styles/index.scss'

const preview: Preview = {
  parameters: {
    a11y: {
      test: 'error',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
