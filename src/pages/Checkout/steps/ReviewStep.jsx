import { useCart } from '@/context/CartContext'
import { getBranchById } from '@/data/branches'
import { getOrderType, ORDER_TYPES } from '@/data/orderTypes'
import { getPaymentMethod } from '@/data/paymentMethods'
import { summariseOptions } from '@/utils/cart'
import { formatPrice } from '@/utils/money'
import styles from './CheckoutSteps.module.css'

/** Step 5 — everything at a glance, with a way back to each step. */
export function ReviewStep({ form, orderType, branchId, onEditStep }) {
  const { lines } = useCart()
  const orderTypeConfig = getOrderType(orderType)
  const branch = branchId ? getBranchById(branchId) : null
  const paymentMethod = getPaymentMethod(form.paymentMethod)

  return (
    <div className={styles.step}>
      <h2 className={styles.title}>Check everything over</h2>
      <p className={styles.intro}>Nothing is placed until you press the button below.</p>

      <ReviewSection title="Order type" onEdit={() => onEditStep('order-type')}>
        {orderTypeConfig.label} — {orderTypeConfig.tagline.toLowerCase()}
      </ReviewSection>

      <ReviewSection title="Your details" onEdit={() => onEditStep('details')}>
        {form.fullName}
        <br />
        {form.phone}
        {form.email && (
          <>
            <br />
            {form.email}
          </>
        )}
      </ReviewSection>

      <ReviewSection
        title={orderType === ORDER_TYPES.DELIVERY ? 'Delivery address' : 'Branch'}
        onEdit={() => onEditStep('fulfilment')}
      >
        {orderType === ORDER_TYPES.DELIVERY ? (
          <>
            {form.building}
            {form.floor && `, floor ${form.floor}`}
            {form.apartment && `, apt ${form.apartment}`}
            <br />
            {form.street}, {form.area}
            {form.instructions && (
              <>
                <br />
                <em>{form.instructions}</em>
              </>
            )}
          </>
        ) : (
          <>
            {branch?.name}
            <br />
            {branch?.address}
            {orderType === ORDER_TYPES.DINE_IN && form.tableNumber && (
              <>
                <br />
                Table {form.tableNumber}
              </>
            )}
          </>
        )}
      </ReviewSection>

      <ReviewSection title="Payment" onEdit={() => onEditStep('payment')}>
        {paymentMethod?.label}
      </ReviewSection>

      <div className={styles.reviewSection}>
        <div className={styles.reviewHeader}>
          <h3 className={styles.reviewTitle}>Items</h3>
        </div>

        <ul className={styles.reviewLines}>
          {lines.map((line) => {
            const optionsSummary = summariseOptions(line.options)

            return (
              <li key={line.lineId} className={styles.reviewLine}>
                <span className={styles.reviewLineName}>
                  {line.quantity} × {line.name}
                  {optionsSummary && (
                    <span className={styles.reviewLineOptions}>{optionsSummary}</span>
                  )}
                </span>
                <span className={styles.reviewLinePrice}>
                  {formatPrice(line.unitPrice * line.quantity)}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

function ReviewSection({ title, onEdit, children }) {
  return (
    <section className={styles.reviewSection}>
      <div className={styles.reviewHeader}>
        <h3 className={styles.reviewTitle}>{title}</h3>
        <button type="button" className={styles.editButton} onClick={onEdit}>
          Edit
        </button>
      </div>
      <p className={styles.reviewBody}>{children}</p>
    </section>
  )
}
