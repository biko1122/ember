import { Icon } from '@/components/Icon/Icon'
import { useCart } from '@/context/CartContext'
import { orderTypes } from '@/data/orderTypes'
import styles from './OrderTypeSelector.module.css'

/**
 * Delivery / Pickup / Dine In picker.
 *
 * The choice lives in the cart because it changes what the order costs, so
 * this component can be dropped anywhere without extra wiring.
 *
 *   layout    'grid' (three cards) | 'stacked' (vertical rows)
 *   compact   tighter spacing, for the mobile menu
 *   onSelect  optional callback, e.g. to close the modal it sits in
 */
export function OrderTypeSelector({ layout = 'grid', compact = false, onSelect }) {
  const { orderType, setOrderType } = useCart()

  const handleSelect = (typeId) => {
    setOrderType(typeId)
    onSelect?.(typeId)
  }

  return (
    <div
      className={`${styles.group} ${styles[layout]} ${compact ? styles.compact : ''}`}
      role="radiogroup"
      aria-label="Order type"
    >
      {orderTypes.map((type) => {
        const isSelected = type.id === orderType

        return (
          <button
            key={type.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={styles.option}
            data-selected={isSelected}
            onClick={() => handleSelect(type.id)}
          >
            <span className={styles.iconWrap}>
              <Icon name={type.icon} size={compact ? 20 : 24} />
            </span>

            <span className={styles.text}>
              <span className={styles.label}>{type.label}</span>
              <span className={styles.tagline}>{type.tagline}</span>
            </span>

            <span className={styles.estimate}>{type.estimate}</span>
          </button>
        )
      })}
    </div>
  )
}
