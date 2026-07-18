import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppClassic from './AppClassic.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppClassic />
  </StrictMode>,
)
