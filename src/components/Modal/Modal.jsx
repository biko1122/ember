import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@/components/Icon/Icon'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import styles from './Modal.module.css'

/**
 * Accessible dialog used for the product customizer.
 *
 * Closes on Escape and on backdrop click, locks the page behind it, and moves
 * focus into the panel when it opens.
 *
 *   size  'md' | 'lg'
 */
export function Modal({ isOpen, onClose, title, size = 'md', children, footer }) {
  const panelRef = useRef(null)

  useBodyScrollLock(isOpen)

  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    panelRef.current?.focus()

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={panelRef}
        className={`${styles.panel} ${styles[size]}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className={styles.closeButton} onClick={onClose}>
          <Icon name="close" size={20} />
          <span className="visually-hidden">Close</span>
        </button>

        <div className={styles.body}>{children}</div>

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
