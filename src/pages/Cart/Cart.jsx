import { PageHeader } from '@/components/PageHeader/PageHeader'
import { CartItem } from '@/components/CartItem/CartItem'
import { CartSummary } from '@/components/CartSummary/CartSummary'
import { PromoCodeInput } from '@/components/PromoCodeInput/PromoCodeInput'
import { OrderTypeSelector } from '@/components/OrderTypeSelector/OrderTypeSelector'
import { EmptyState } from '@/components/EmptyState/EmptyState'
import { Button } from '@/components/Button/Button'
import { useCart } from '@/context/CartContext'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { orderSettings } from '@/config/restaurant'
import { formatPrice } from '@/utils/money'
import styles from './Cart.module.css'

export function Cart() {
  const { lines, isEmpty, itemCount, clearCart, canCheckout, totals } = useCart()

  useDocumentTitle('Your basket', 'Review your basket before checking out.')

  if (isEmpty) {
    return (
      <>
        <PageHeader eyebrow="Your order" title="Your basket" />
        <div className={`page-container ${styles.emptyWrap}`}>
          <EmptyState
            icon="cart"
            title="Nothing in the basket yet"
            description="Once you add something from the menu it will show up here, ready to check out."
            actionLabel="Browse the menu"
            actionTo="/menu"
          />
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow="Your order"
        title="Your basket"
        description={`${itemCount} ${itemCount === 1 ? 'item' : 'items'} ready to go.`}
      />

      <div className={`page-container ${styles.layout}`}>
        <div className={styles.main}>
          <section className={styles.block} aria-labelledby="cart-order-type">
            <h2 id="cart-order-type" className={styles.blockTitle}>
              How would you like it?
            </h2>
            <OrderTypeSelector />
          </section>

          <section className={styles.block} aria-labelledby="cart-items">
            <div className={styles.blockHeader}>
              <h2 id="cart-items" className={styles.blockTitle}>
                Items
              </h2>
              <button type="button" className={styles.clearButton} onClick={clearCart}>
                Clear basket
              </button>
            </div>

            <ul className={styles.lines}>
              {lines.map((line) => (
                <CartItem key={line.lineId} line={line} />
              ))}
            </ul>
          </section>
        </div>

        <aside className={styles.sidebar}>
          <section className={styles.promoBlock} aria-labelledby="cart-promo">
            <h2 id="cart-promo" className={styles.blockTitle}>
              Have a promo code?
            </h2>
            <PromoCodeInput />
          </section>

          <CartSummary>
            <Button to="/checkout" disabled={!canCheckout} fullWidth iconAfter="arrowRight">
              Proceed to checkout
            </Button>
            <Button to="/menu" variant="ghost" fullWidth>
              Continue shopping
            </Button>
          </CartSummary>

          {!canCheckout && (
            <p className={styles.minimumNotice}>
              Delivery orders start at {formatPrice(orderSettings.minimumDeliveryOrder)}. Add{' '}
              {formatPrice(orderSettings.minimumDeliveryOrder - totals.subtotal)} more, or switch to
              pickup.
            </p>
          )}
        </aside>
      </div>
    </>
  )
}
