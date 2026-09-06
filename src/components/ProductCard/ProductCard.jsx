import { Link } from 'react-router-dom'
import { AppImage } from '@/components/AppImage/AppImage'
import { Icon } from '@/components/Icon/Icon'
import { Tag, ProductTags } from '@/components/Tag/Tag'
import { FavoriteButton } from '@/components/FavoriteButton/FavoriteButton'
import { useAddToCart } from '@/hooks/useAddToCart'
import { formatPrice, calculateDiscountPercentage } from '@/utils/money'
import styles from './ProductCard.module.css'

/**
 * A single product tile.
 *
 * Tapping the card opens the product page. Tapping "Add" either drops the item
 * straight into the basket, or — when the item has options — asks the parent
 * to open the customizer via `onCustomize`.
 */
export function ProductCard({ item, onCustomize }) {
  const addToCart = useAddToCart()
  const discount = calculateDiscountPercentage(item.price, item.oldPrice)
  const hasOptions = Boolean(item.customizations?.length)

  const handleAdd = (event) => {
    event.preventDefault()
    if (hasOptions && onCustomize) {
      onCustomize(item)
    } else {
      addToCart(item)
    }
  }

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {/* Hidden from assistive tech — the product name below is the real link. */}
        <Link to={`/menu/${item.id}`} className={styles.imageLink} tabIndex={-1} aria-hidden="true">
          <AppImage src={item.image} alt={item.name} ratio="wide" className={styles.image} />
        </Link>

        {discount > 0 && (
          <Tag tone="primary" className={styles.discountBadge}>
            −{discount}%
          </Tag>
        )}

        <FavoriteButton item={item} className={styles.favorite} />

        <div className={styles.tags}>
          <ProductTags item={item} />
        </div>
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>
          <Link to={`/menu/${item.id}`} className={styles.nameLink}>
            {item.name}
          </Link>
        </h3>

        <p className={styles.description}>{item.description}</p>

        <div className={styles.footer}>
          <p className={styles.prices}>
            <span className={styles.price}>{formatPrice(item.price)}</span>
            {item.oldPrice && <span className={styles.oldPrice}>{formatPrice(item.oldPrice)}</span>}
          </p>

          <button
            type="button"
            className={styles.addButton}
            onClick={handleAdd}
            aria-label={hasOptions ? `Choose options for ${item.name}` : `Add ${item.name} to basket`}
          >
            <Icon name="plus" size={18} strokeWidth={2.4} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </article>
  )
}
