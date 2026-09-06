import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { ToastStack } from '@/components/Toast/ToastStack'

/**
 * Small, self-dismissing confirmations — "Added to your basket", "Code
 * applied", and so on. Call `showToast` from anywhere in the app.
 */

const ToastContext = createContext(null)

const DEFAULT_DURATION = 2800

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const nextId = useRef(0)

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (message, { variant = 'success', duration = DEFAULT_DURATION } = {}) => {
      const id = nextId.current++
      setToasts((current) => [...current, { id, message, variant }])
      setTimeout(() => dismissToast(id), duration)
    },
    [dismissToast],
  )

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used inside a <ToastProvider>.')
  }
  return context
}
