import { OrderTypeSelector } from '@/components/OrderTypeSelector/OrderTypeSelector'
import styles from './CheckoutSteps.module.css'

/** Step 1 — delivery, pickup or dine in. */
export function OrderTypeStep() {
  return (
    <div className={styles.step}>
      <h2 className={styles.title}>How would you like your order?</h2>
      <p className={styles.intro}>
        This decides what we ask for next — an address, or a branch to collect from.
      </p>

      <OrderTypeSelector />
    </div>
  )
}
