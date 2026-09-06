import { createPortal } from 'react-dom'
import { Icon } from '@/components/Icon/Icon'
import styles from './ToastStack.module.css'

const TOAST_ICONS = {
  success: 'check',
  error: 'info',
  info: 'info',
}

/**
 * Renders the queue of toasts held by ToastContext. Nothing else uses this
 * directly — call `useToast().showToast(...)` instead.
 */
export function ToastStack({ toasts, onDismiss }) {
  if (toasts.length === 0) return null

  return createPortal(
    <div className={styles.stack} role="status" aria-live="polite">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          className={`${styles.toast} ${styles[toast.variant]}`}
          onClick={() => onDismiss(toast.id)}
        >
          <Icon name={TOAST_ICONS[toast.variant] ?? 'info'} size={18} strokeWidth={2.2} />
          <span>{toast.message}</span>
        </button>
      ))}
    </div>,
    document.body,
  )
}
