import { Link } from 'react-router-dom'
import { AppImage } from '@/components/AppImage/AppImage'
import { categories, FEATURED_CATEGORY_ID } from '@/data/categories'
import styles from './CategoryTiles.module.css'

/**
 * Homepage category tiles: a photo per category with the name over it.
 * Each one opens the menu already filtered.
 *
 * The virtual "Featured" category is skipped — the menu shows it by default.
 */
export function CategoryTiles() {
  const browsableCategories = categories.filter(
    (category) => category.id !== FEATURED_CATEGORY_ID,
  )

  return (
    <ul className={styles.tiles}>
      {browsableCategories.map((category) => (
        <li key={category.id}>
          <Link to={`/menu?category=${category.id}`} className={styles.tile}>
            <AppImage src={category.image} alt="" ratio="square" className={styles.image} />
            <span className={styles.scrim} />
            <span className={styles.name}>{category.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
