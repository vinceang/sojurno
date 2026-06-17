import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { I18nProvider } from './i18n/I18nProvider'
import { ThemeProvider } from './role/ThemeProvider'
import './styles/tailwind.css'
import './styles/index.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <I18nProvider>
          <App />
        </I18nProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
