import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from '@/App'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { LoyaltyProvider } from '@/context/LoyaltyContext'
import { ToastProvider } from '@/context/ToastContext'
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary'
import '@/styles/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <LoyaltyProvider>
              <CartProvider>
                <FavoritesProvider>
                  <App />
                </FavoritesProvider>
              </CartProvider>
            </LoyaltyProvider>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
