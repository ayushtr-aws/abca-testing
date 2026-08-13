import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider, createAppAuthService } from './auth'

const authService = createAppAuthService()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider service={authService}>
      <App />
    </AuthProvider>
  </StrictMode>,
)
