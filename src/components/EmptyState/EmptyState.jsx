import { Icon } from '@/components/Icon/Icon'
import { Button } from '@/components/Button/Button'
import styles from './EmptyState.module.css'

/**
 * Shared "nothing here yet" panel — empty cart, no search results, no saved
 * addresses, no orders. Keeping it in one place means every empty screen on
 * the site reads the same way.
 */
export function EmptyState({ icon = 'info', title, description, actionLabel, actionTo, onAction }) {
  return (
    <div className={styles.empty}>
      <span className={styles.icon}>
        <Icon name={icon} size={28} />
      </span>

      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}

      {actionLabel && (
        <Button to={actionTo} onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
