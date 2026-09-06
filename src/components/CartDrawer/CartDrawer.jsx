import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/components/Icon/Icon'
import { Button } from '@/components/Button/Button'
import { CartItem } from '@/components/CartItem/CartItem'
import { CartSummary } from '@/components/CartSummary/CartSummary'
import { EmptyState } from '@/components/EmptyState/EmptyState'
import { useCart } from '@/context/CartContext'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { orderSettings } from '@/config/restaurant'
import { formatPrice } from '@/utils/money'
import styles from './CartDrawer.module.css'

/**
 * Slide-out basket, opened from the navbar cart button.
 * Mounted once in App so it is available on every page.
 */
export function CartDrawer() {
  const navigate = useNavigate()
  const { lines, isEmpty, isCartOpen, closeCart, canCheckout, totals, itemCount } = useCart()

  useBodyScrollLock(isCartOpen)

  useEffect(() => {
    if (!isCartOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeCart()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isCartOpen, closeCart])

  if (!isCartOpen) return null

  const goTo = (path) => {
    closeCart()
    navigate(path)
  }

  return (
    <div className={styles.overlay} onClick={closeCart}>
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Your basket"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 className={styles.title}>
            Your basket
            {itemCount > 0 && <span className={styles.count}>{itemCount}</span>}
          </h2>

          <button type="button" className={styles.close} onClick={closeCart} aria-label="Close basket">
            <Icon name="close" size={22} />
          </button>
        </header>

        {isEmpty ? (
          <div className={styles.emptyWrap}>
            <EmptyState
              icon="cart"
              title="Your basket is empty"
              description="Add something from the menu and it will show up here."
              actionLabel="Browse the menu"
              onAction={() => goTo('/menu')}
            />
          </div>
        ) : (
          <>
            <ul className={styles.lines}>
              {lines.map((line) => (
                <CartItem key={line.lineId} line={line} compact />
              ))}
            </ul>

            <footer className={styles.footer}>
              <CartSummary title="Summary">
                <Button
                  onClick={() => goTo('/checkout')}
                  disabled={!canCheckout}
                  fullWidth
                  iconAfter="arrowRight"
                >
                  Checkout
                </Button>
                <Button variant="ghost" onClick={() => goTo('/cart')} fullWidth>
                  View full basket
                </Button>
              </CartSummary>

              {!canCheckout && (
                <p className={styles.minimumNotice}>
                  Delivery orders start at {formatPrice(orderSettings.minimumDeliveryOrder)}. Add{' '}
                  {formatPrice(orderSettings.minimumDeliveryOrder - totals.subtotal)} more to
                  continue.
                </p>
              )}
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
