import type { Preview } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { SavedListingsProvider } from '../src/components/SavedListingsProvider'
import { ToastProvider } from '../src/components/ToastProvider'
import { UserListingsProvider } from '../src/components/UserListingsProvider'
import { I18nProvider } from '../src/i18n/I18nProvider'
import { SessionProvider } from '../src/session/SessionProvider'
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
  // Every story renders inside router + i18n + session/toast/saved context so composites that use
  // <Link>, useNavigate, useI18n, or the save-gate (ListingCard heart) work without per-story setup.
  decorators: [
    (Story) => (
      <MemoryRouter>
        <I18nProvider>
          <SessionProvider>
            <ToastProvider>
              <SavedListingsProvider>
                <UserListingsProvider>
                  <Story />
                </UserListingsProvider>
              </SavedListingsProvider>
            </ToastProvider>
          </SessionProvider>
        </I18nProvider>
      </MemoryRouter>
    ),
  ],
}

export default preview
