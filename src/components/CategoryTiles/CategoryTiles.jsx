import { Link } from 'react-router-dom'
import { AppImage } from '@/components/AppImage/AppImage'
import { categories, FEATURED_CATEGORY_ID } from '@/data/categories'
import styles from './CategoryTiles.module.css'

/**
 * The categories a customer can browse — everything except the virtual
 * "Featured" one, which the menu already shows by default.
 */
export function getBrowsableCategories() {
  return categories.filter((category) => category.id !== FEATURED_CATEGORY_ID)
}

/** One category: its picture with the name over it, opening a filtered menu. */
export function CategoryTile({ category }) {
  return (
    <Link to={`/menu?category=${category.id}`} className={styles.tile}>
      <AppImage src={category.image} alt="" ratio="square" className={styles.image} />
      <span className={styles.scrim} />
      <span className={styles.name}>{category.name}</span>
    </Link>
  )
}

/** The full grid of categories, used where there is room for all of them. */
export function CategoryTiles() {
  return (
    <ul className={styles.tiles}>
      {getBrowsableCategories().map((category) => (
        <li key={category.id}>
          <CategoryTile category={category} />
        </li>
      ))}
    </ul>
  )
}
