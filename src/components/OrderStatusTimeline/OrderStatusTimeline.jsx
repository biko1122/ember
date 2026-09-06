import { Icon } from '@/components/Icon/Icon'
import { getOrderProgress } from '@/utils/orders'
import styles from './OrderStatusTimeline.module.css'

/**
 * The "Received → Preparing → Ready → Completed" tracker.
 *
 * DEMO NOTE: progress is worked out from how long ago the order was placed,
 * not from a real kitchen. See utils/orders.js.
 */
export function OrderStatusTimeline({ order }) {
  const { stages } = getOrderProgress(order)

  return (
    <ol className={styles.timeline}>
      {stages.map((stage) => (
        <li key={stage.status} className={styles.stage} data-state={stage.state}>
          <span className={styles.marker}>
            {stage.state === 'done' && <Icon name="check" size={14} strokeWidth={3} />}
          </span>
          <span className={styles.label}>{stage.label}</span>
        </li>
      ))}
    </ol>
  )
}
