import { PageHeader } from '@/components/PageHeader/PageHeader'
import { Button } from '@/components/Button/Button'
import { Tag } from '@/components/Tag/Tag'
import { EmptyState } from '@/components/EmptyState/EmptyState'
import { useOrders } from '@/hooks/useOrders'
import { useReorder } from '@/hooks/useReorder'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { getOrderType } from '@/data/orderTypes'
import { countOrderItems, formatOrderDate, getOrderProgress } from '@/utils/orders'
import { summariseOptions } from '@/utils/cart'
import { formatPrice } from '@/utils/money'
import styles from './Orders.module.css'

/** Past orders, newest first. */
export function Orders() {
  const { orders } = useOrders()

  useDocumentTitle('My orders', 'Look back at what you have ordered and reorder in one tap.')

  return (
    <>
      <PageHeader
        eyebrow="Order history"
        title="My orders"
        description="Everything you have ordered from this device, newest first."
      />

      <div className={`page-container ${styles.page}`}>
        {orders.length === 0 ? (
          <EmptyState
            icon="bag"
            title="No orders yet"
            description="When you place an order it will show up here, ready to reorder any time."
            actionLabel="Browse the menu"
            actionTo="/menu"
          />
        ) : (
          <ul className={styles.list}>
            {orders.map((order) => (
              <li key={order.orderNumber}>
                <OrderCard order={order} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

function OrderCard({ order }) {
  const reorder = useReorder()
  const progress = getOrderProgress(order)
  const orderTypeConfig = getOrderType(order.orderType)

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.orderNumber}>Order {order.orderNumber}</h2>
          <p className={styles.date}>{formatOrderDate(order.placedAt)}</p>
        </div>

        <div className={styles.headerTags}>
          <Tag tone="neutral" icon={orderTypeConfig.icon}>
            {orderTypeConfig.label}
          </Tag>
          <Tag tone={progress.isComplete ? 'success' : 'primary'}>{progress.statusLabel}</Tag>
        </div>
      </header>

      <ul className={styles.lines}>
        {order.lines.map((line) => {
          const optionsSummary = summariseOptions(line.options)

          return (
            <li key={line.lineId} className={styles.line}>
              {line.quantity} × {line.name}
              {optionsSummary && <span className={styles.lineOptions}>{optionsSummary}</span>}
            </li>
          )
        })}
      </ul>

      <footer className={styles.footer}>
        <p className={styles.total}>
          {formatPrice(order.totals.total)}
          <span className={styles.itemCount}>{countOrderItems(order)} items</span>
        </p>

        <div className={styles.actions}>
          <Button to={`/orders/${order.orderNumber}`} variant="outline" size="sm">
            View order
          </Button>
          <Button onClick={() => reorder(order)} size="sm">
            Reorder
          </Button>
        </div>
      </footer>
    </article>
  )
}
