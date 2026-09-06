import { useParams } from 'react-router-dom'
import { Button } from '@/components/Button/Button'
import { Icon } from '@/components/Icon/Icon'
import { Tag } from '@/components/Tag/Tag'
import { EmptyState } from '@/components/EmptyState/EmptyState'
import { OrderStatusTimeline } from '@/components/OrderStatusTimeline/OrderStatusTimeline'
import { useOrders } from '@/hooks/useOrders'
import { useReorder } from '@/hooks/useReorder'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { getBranchById } from '@/data/branches'
import { getOrderType, ORDER_TYPES } from '@/data/orderTypes'
import { getPaymentMethod } from '@/data/paymentMethods'
import { orderSettings } from '@/config/restaurant'
import { formatOrderDate, getOrderProgress } from '@/utils/orders'
import { summariseOptions } from '@/utils/cart'
import { formatPrice } from '@/utils/money'
import styles from './OrderConfirmation.module.css'

/**
 * One order: the thank-you screen straight after checkout, and the same page
 * later on when someone opens an order from their history.
 */
export function OrderConfirmation() {
  const { orderNumber } = useParams()
  const { getOrder } = useOrders()
  const order = getOrder(orderNumber)

  useDocumentTitle(order ? `Order ${order.orderNumber}` : 'Order not found')

  if (!order) {
    return (
      <div className={`page-container ${styles.missing}`}>
        <EmptyState
          icon="info"
          title="We could not find that order"
          description="Orders in this demo are stored on the device you ordered from, so they will not show up in another browser."
          actionLabel="Back to the menu"
          actionTo="/menu"
        />
      </div>
    )
  }

  return <OrderView order={order} />
}

function OrderView({ order }) {
  const reorder = useReorder()

  const progress = getOrderProgress(order)
  const orderTypeConfig = getOrderType(order.orderType)
  const branch = order.branchId ? getBranchById(order.branchId) : null
  const paymentMethod = getPaymentMethod(order.paymentMethod)
  const isFreshOrder = Date.now() - new Date(order.placedAt).getTime() < 2 * 60 * 1000

  return (
    <div className={`page-container ${styles.page}`}>
      <header className={styles.header}>
        {isFreshOrder && (
          <span className={styles.successMark}>
            <Icon name="check" size={30} strokeWidth={3} />
          </span>
        )}

        <h1 className={styles.title}>
          {isFreshOrder ? 'Order confirmed' : `Order ${order.orderNumber}`}
        </h1>

        <p className={styles.subtitle}>
          {isFreshOrder
            ? `Thank you, ${order.customer.fullName.split(' ')[0]} — order ${order.orderNumber} is with our kitchen.`
            : `Placed ${formatOrderDate(order.placedAt)}`}
        </p>

        {isFreshOrder && (
          <p className={styles.estimate}>
            <Icon name="clock" size={18} />
            Estimated{' '}
            {order.orderType === ORDER_TYPES.DELIVERY ? 'delivery' : 'preparation'} time:{' '}
            <strong>
              {order.orderType === ORDER_TYPES.DELIVERY
                ? orderSettings.deliveryTime
                : orderSettings.preparationTime}
            </strong>
          </p>
        )}
      </header>

      <div className={styles.layout}>
        <section className={styles.card} aria-labelledby="tracking-title">
          <div className={styles.cardHeader}>
            <h2 id="tracking-title" className={styles.cardTitle}>
              Order progress
            </h2>
            <Tag tone={progress.isComplete ? 'success' : 'primary'}>{progress.statusLabel}</Tag>
          </div>

          <OrderStatusTimeline order={order} />

          <p className={styles.demoNote}>
            <Icon name="info" size={16} />
            Demo tracking — progress is simulated from the time you ordered, not from a real
            kitchen.
          </p>
        </section>

        <section className={styles.card} aria-labelledby="summary-title">
          <h2 id="summary-title" className={styles.cardTitle}>
            Order summary
          </h2>

          <ul className={styles.lines}>
            {order.lines.map((line) => {
              const optionsSummary = summariseOptions(line.options)

              return (
                <li key={line.lineId} className={styles.line}>
                  <span>
                    {line.quantity} × {line.name}
                    {optionsSummary && <span className={styles.lineOptions}>{optionsSummary}</span>}
                  </span>
                  <span className={styles.linePrice}>
                    {formatPrice(line.unitPrice * line.quantity)}
                  </span>
                </li>
              )
            })}
          </ul>

          <dl className={styles.totals}>
            <div className={styles.totalRow}>
              <dt>Subtotal</dt>
              <dd>{formatPrice(order.totals.subtotal)}</dd>
            </div>

            {order.totals.discount > 0 && (
              <div className={styles.totalRow}>
                <dt>Discount {order.promoCode && `(${order.promoCode})`}</dt>
                <dd>− {formatPrice(order.totals.discount)}</dd>
              </div>
            )}

            {order.orderType === ORDER_TYPES.DELIVERY && (
              <div className={styles.totalRow}>
                <dt>Delivery</dt>
                <dd>
                  {order.totals.deliveryFee === 0 ? 'Free' : formatPrice(order.totals.deliveryFee)}
                </dd>
              </div>
            )}

            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <dt>Total</dt>
              <dd>{formatPrice(order.totals.total)}</dd>
            </div>
          </dl>
        </section>

        <section className={styles.card} aria-labelledby="details-title">
          <h2 id="details-title" className={styles.cardTitle}>
            Order details
          </h2>

          <dl className={styles.details}>
            <DetailRow label="Order number" value={order.orderNumber} />
            <DetailRow label="Placed" value={formatOrderDate(order.placedAt)} />
            <DetailRow label="Order type" value={orderTypeConfig.label} />
            <DetailRow label="Payment" value={paymentMethod?.label ?? order.paymentMethod} />
            <DetailRow label="Name" value={order.customer.fullName} />
            <DetailRow label="Phone" value={order.customer.phone} />

            {order.deliveryAddress && (
              <DetailRow
                label="Address"
                value={[
                  order.deliveryAddress.building,
                  order.deliveryAddress.street,
                  order.deliveryAddress.area,
                ]
                  .filter(Boolean)
                  .join(', ')}
              />
            )}

            {branch && <DetailRow label="Branch" value={`${branch.name} — ${branch.address}`} />}
            {order.tableNumber && <DetailRow label="Table" value={order.tableNumber} />}
          </dl>
        </section>
      </div>

      <div className={styles.actions}>
        <Button onClick={() => reorder(order)} variant="primary">
          Reorder these items
        </Button>
        <Button to="/orders" variant="outline">
          All my orders
        </Button>
        <Button to="/" variant="ghost">
          Back to home
        </Button>
      </div>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className={styles.detailRow}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}
