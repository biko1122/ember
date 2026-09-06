import { Link } from 'react-router-dom'
import { AppImage } from '@/components/AppImage/AppImage'
import { Icon } from '@/components/Icon/Icon'
import { QuantitySelector } from '@/components/QuantitySelector/QuantitySelector'
import { useCart } from '@/context/CartContext'
import { summariseOptions } from '@/utils/cart'
import { formatPrice } from '@/utils/money'
import styles from './CartItem.module.css'

/**
 * One row in the basket. Used by both the slide-out drawer and the cart page —
 * `compact` just tightens it up for the drawer.
 */
export function CartItem({ line, compact = false }) {
  const { updateQuantity, removeLine } = useCart()
  const optionsSummary = summariseOptions(line.options)

  return (
    <li className={`${styles.item} ${compact ? styles.compact : ''}`}>
      <AppImage
        src={line.image}
        alt={line.name}
        ratio="square"
        className={styles.image}
      />

      <div className={styles.details}>
        <Link to={`/menu/${line.itemId}`} className={styles.name}>
          {line.name}
        </Link>

        {optionsSummary && <p className={styles.options}>{optionsSummary}</p>}

        <p className={styles.unitPrice}>{formatPrice(line.unitPrice)} each</p>

        <div className={styles.controls}>
          <QuantitySelector
            quantity={line.quantity}
            onChange={(quantity) => updateQuantity(line.lineId, quantity)}
            min={1}
            size="sm"
            label={`${line.name} quantity`}
          />

          <button
            type="button"
            className={styles.remove}
            onClick={() => removeLine(line.lineId)}
            aria-label={`Remove ${line.name} from basket`}
          >
            <Icon name="trash" size={16} />
            <span className={styles.removeLabel}>Remove</span>
          </button>
        </div>
      </div>

      <p className={styles.lineTotal}>{formatPrice(line.unitPrice * line.quantity)}</p>
    </li>
  )
}
