import { Icon } from '@/components/Icon/Icon'
import styles from './QuantitySelector.module.css'

/**
 * The [-] 2 [+] control, used in the product modal and on every cart row.
 *
 *   min   set to 0 in the cart so the last decrease removes the line
 */
export function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 30,
  size = 'md',
  label = 'Quantity',
}) {
  const decrease = () => onChange(Math.max(min, quantity - 1))
  const increase = () => onChange(Math.min(max, quantity + 1))

  return (
    <div className={`${styles.selector} ${styles[size]}`} role="group" aria-label={label}>
      <button
        type="button"
        className={styles.step}
        onClick={decrease}
        disabled={quantity <= min}
        aria-label={`Decrease ${label.toLowerCase()}`}
      >
        <Icon name="minus" size={16} />
      </button>

      <span className={styles.value} aria-live="polite">
        {quantity}
      </span>

      <button
        type="button"
        className={styles.step}
        onClick={increase}
        disabled={quantity >= max}
        aria-label={`Increase ${label.toLowerCase()}`}
      >
        <Icon name="plus" size={16} />
      </button>
    </div>
  )
}
