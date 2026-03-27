import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ReactQueryProvider } from './lib/react-query'
import { suppressConsoleWarnings } from './utils/suppressConsoleWarnings'

// Reduce noisy dev-only console warnings coming from legacy scripts.
if (import.meta.env.DEV) {
  suppressConsoleWarnings()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryProvider>
      <App />
    </ReactQueryProvider>
  </StrictMode>,
)
