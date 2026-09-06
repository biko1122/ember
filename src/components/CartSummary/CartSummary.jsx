import { Icon } from '@/components/Icon/Icon'
import { useCart } from '@/context/CartContext'
import { orderSettings } from '@/config/restaurant'
import { ORDER_TYPES } from '@/data/orderTypes'
import { formatPrice } from '@/utils/money'
import styles from './CartSummary.module.css'

/**
 * Subtotal / delivery / discount / total.
 *
 * Reads straight from the cart, so the drawer, the basket page and the order
 * review can never show different numbers. Pass buttons as children.
 */
export function CartSummary({ title = 'Order summary', children }) {
  const { totals, promo, orderType, removePromoCode } = useCart()
  const isDelivery = orderType === ORDER_TYPES.DELIVERY

  const amountToFreeDelivery =
    isDelivery && orderSettings.freeDeliveryAbove !== null
      ? orderSettings.freeDeliveryAbove - totals.subtotal
      : 0

  return (
    <div className={styles.summary}>
      <h3 className={styles.title}>{title}</h3>

      <dl className={styles.rows}>
        <div className={styles.row}>
          <dt>Subtotal</dt>
          <dd>{formatPrice(totals.subtotal)}</dd>
        </div>

        {isDelivery && (
          <div className={styles.row}>
            <dt>Delivery fee</dt>
            <dd>{totals.deliveryFee === 0 ? 'Free' : formatPrice(totals.deliveryFee)}</dd>
          </div>
        )}

        {promo && (
          <div className={`${styles.row} ${styles.promoRow}`}>
            <dt>
              Promo · {promo.code}
              <button
                type="button"
                className={styles.removePromo}
                onClick={removePromoCode}
                aria-label={`Remove promo code ${promo.code}`}
              >
                <Icon name="close" size={13} strokeWidth={2.4} />
              </button>
            </dt>
            <dd>{totals.discount > 0 ? `− ${formatPrice(totals.discount)}` : promo.description}</dd>
          </div>
        )}

        <div className={`${styles.row} ${styles.totalRow}`}>
          <dt>Total</dt>
          <dd>{formatPrice(totals.total)}</dd>
        </div>
      </dl>

      {amountToFreeDelivery > 0 && totals.subtotal > 0 && (
        <p className={styles.hint}>
          <Icon name="truck" size={16} />
          Add {formatPrice(amountToFreeDelivery)} more for free delivery.
        </p>
      )}

      {children && <div className={styles.actions}>{children}</div>}
    </div>
  )
}
