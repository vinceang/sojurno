import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { SavedListingsProvider } from './components/SavedListingsProvider'
import { ToastProvider } from './components/ToastProvider'
import { UserListingsProvider } from './components/UserListingsProvider'
import { I18nProvider } from './i18n/I18nProvider'
import { SessionProvider } from './session/SessionProvider'
import { ThemeProvider } from './theme/ThemeProvider'
import './styles/tailwind.css'
import './styles/index.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <I18nProvider>
          <SessionProvider>
            <ToastProvider>
              <SavedListingsProvider>
                <UserListingsProvider>
                  <App />
                </UserListingsProvider>
              </SavedListingsProvider>
            </ToastProvider>
          </SessionProvider>
        </I18nProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
