import { Button } from '@/components/Button/Button'
import { Icon } from '@/components/Icon/Icon'
import { CartItem } from '@/components/CartItem/CartItem'
import { CartSummary } from '@/components/CartSummary/CartSummary'
import { useCart } from '@/context/CartContext'
import { orderSettings } from '@/config/restaurant'
import { formatPrice } from '@/utils/money'
import styles from './CartPanel.module.css'

/**
 * The basket, in the page rather than over it.
 *
 * Same contents as the slide-out drawer — the drawer is still there for every
 * page that has no room for this, and for phones. What changes is that on the
 * menu, where someone is adding things one after another, the basket is simply
 * visible: what is in it, what it costs, and the way to checkout, without a
 * trip to the header and back for each item.
 *
 * It holds no state of its own. Every line, total and rule comes from the cart
 * context, so this panel and the drawer can never disagree.
 */
export function CartPanel() {
  const { lines, isEmpty, itemCount, canCheckout, totals } = useCart()

  return (
    <section className={styles.panel} aria-labelledby="cart-panel-title">
      <header className={styles.header}>
        <h2 id="cart-panel-title" className={styles.title}>
          <Icon name="cart" size={19} />
          Your basket
        </h2>

        {itemCount > 0 && (
          <span className={styles.count}>
            {itemCount}
            <span className="visually-hidden"> items</span>
          </span>
        )}
      </header>

      {isEmpty ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>
            <Icon name="bag" size={22} />
          </span>
          <p className={styles.emptyTitle}>Nothing in here yet</p>
          <p className={styles.emptyHint}>
            Add something from the menu and it will appear here as you go.
          </p>
        </div>
      ) : (
        <>
          {/* The list is the only part that scrolls, so the total and the
              checkout button stay put however long the order gets. */}
          <ul className={styles.lines}>
            {lines.map((line) => (
              <CartItem key={line.lineId} line={line} compact />
            ))}
          </ul>

          <footer className={styles.footer}>
            <CartSummary title="Summary">
              <Button to="/checkout" disabled={!canCheckout} fullWidth iconAfter="arrowRight">
                Checkout
              </Button>
              <Button to="/cart" variant="ghost" fullWidth>
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
    </section>
  )
}
