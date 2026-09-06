import { Link } from 'react-router-dom'
import { Modal } from '@/components/Modal/Modal'
import { AppImage } from '@/components/AppImage/AppImage'
import { Button } from '@/components/Button/Button'
import { QuantitySelector } from '@/components/QuantitySelector/QuantitySelector'
import { ProductOptions } from '@/components/ProductOptions/ProductOptions'
import { ProductTags } from '@/components/Tag/Tag'
import { useProductSelections } from '@/hooks/useProductSelections'
import { useAddToCart } from '@/hooks/useAddToCart'
import { formatPrice } from '@/utils/money'
import styles from './ProductModal.module.css'

/**
 * Quick customizer opened from a product card, so nobody has to leave the menu
 * to pick a size or add extras.
 *
 * Pass `item = null` to keep it closed.
 */
export function ProductModal({ item, onClose }) {
  if (!item) return null

  // `key` gives each product a fresh set of selections.
  return <ProductCustomizer key={item.id} item={item} onClose={onClose} />
}

function ProductCustomizer({ item, onClose }) {
  const addToCart = useAddToCart()
  const { selections, selectOption, isSelected, quantity, setQuantity, totalPrice } =
    useProductSelections(item)

  const handleAdd = () => {
    addToCart(item, selections, quantity)
    onClose()
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={item.name}
      size="lg"
      /* Pinned below the scrolling options so "Add" is always reachable. */
      footer={
        <div className={styles.actions}>
          <QuantitySelector quantity={quantity} onChange={setQuantity} />
          <Button onClick={handleAdd} fullWidth>
            Add to basket · {formatPrice(totalPrice)}
          </Button>
        </div>
      }
    >
      <div className={styles.layout}>
        <AppImage src={item.image} alt={item.name} ratio="wide" className={styles.image} />

        <div className={styles.details}>
          <div className={styles.tags}>
            <ProductTags item={item} />
          </div>

          <h2 className={styles.name}>{item.name}</h2>
          <p className={styles.description}>{item.description}</p>

          <p className={styles.basePrice}>
            {formatPrice(item.price)}
            {item.calories != null && <span className={styles.calories}>{item.calories} kcal</span>}
          </p>

          <ProductOptions item={item} selectOption={selectOption} isSelected={isSelected} />

          <Link to={`/menu/${item.id}`} className={styles.fullDetailsLink} onClick={onClose}>
            See full details
          </Link>
        </div>
      </div>
    </Modal>
  )
}
