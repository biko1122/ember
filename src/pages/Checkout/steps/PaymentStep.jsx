import { ChoiceList } from '@/components/ChoiceList/ChoiceList'
import { Icon } from '@/components/Icon/Icon'
import { paymentMethods } from '@/data/paymentMethods'
import styles from './CheckoutSteps.module.css'

/**
 * Step 4 — how the customer wants to pay.
 *
 * DEMO NOTE: no money moves and no card details are collected anywhere in this
 * project. See data/paymentMethods.js.
 */
export function PaymentStep({ selectedMethod, onChange }) {
  return (
    <div className={styles.step}>
      <h2 className={styles.title}>How would you like to pay?</h2>

      <ChoiceList
        name="paymentMethod"
        label="Payment method"
        value={selectedMethod}
        onChange={onChange}
        options={paymentMethods}
      />

      <p className={styles.demoNotice}>
        <Icon name="info" size={17} />
        This is a demo site. No payment is processed and no card details are ever requested.
      </p>
    </div>
  )
}
