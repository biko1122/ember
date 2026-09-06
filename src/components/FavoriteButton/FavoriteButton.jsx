import { Icon } from '@/components/Icon/Icon'
import { useFavorites } from '@/context/FavoritesContext'
import styles from './FavoriteButton.module.css'

/**
 * Heart toggle on product cards and product pages. Reads and writes the saved
 * list itself, so parents only need to hand it an item.
 */
export function FavoriteButton({ item, className = '' }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const isSaved = isFavorite(item.id)

  return (
    <button
      type="button"
      className={`${styles.button} ${className}`}
      data-active={isSaved}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggleFavorite(item.id)
      }}
      aria-pressed={isSaved}
      aria-label={isSaved ? `Remove ${item.name} from favourites` : `Save ${item.name} to favourites`}
    >
      <Icon name="heart" size={18} strokeWidth={2} />
    </button>
  )
}
