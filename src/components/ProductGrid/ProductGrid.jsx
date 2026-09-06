import { useState } from 'react'
import { ProductCard } from '@/components/ProductCard/ProductCard'
import { ProductModal } from '@/components/ProductModal/ProductModal'
import styles from './ProductGrid.module.css'

/**
 * Responsive grid of product cards, plus the single customizer modal they all
 * share. Use this anywhere a list of products is shown.
 */
export function ProductGrid({ items }) {
  const [customizingItem, setCustomizingItem] = useState(null)

  return (
    <>
      <ul className={styles.grid}>
        {items.map((item) => (
          <li key={item.id} className={styles.cell}>
            <ProductCard item={item} onCustomize={setCustomizingItem} />
          </li>
        ))}
      </ul>

      <ProductModal item={customizingItem} onClose={() => setCustomizingItem(null)} />
    </>
  )
}
