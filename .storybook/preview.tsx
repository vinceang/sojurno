import type { Preview } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../src/i18n/I18nProvider'
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
  // Every story renders inside router + i18n context so composites that use
  // <Link>, useNavigate, or useI18n work without per-story setup.
  decorators: [
    (Story) => (
      <MemoryRouter>
        <I18nProvider>
          <Story />
        </I18nProvider>
      </MemoryRouter>
    ),
  ],
}

export default preview
