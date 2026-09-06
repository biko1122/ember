import { Icon } from '@/components/Icon/Icon'
import styles from './Tag.module.css'

/**
 * Small pill labels: "Popular", "Spicy", "-14%", order statuses, and so on.
 *
 *   tone  'neutral' | 'primary' | 'success' | 'danger' | 'warm'
 */
export function Tag({ children, tone = 'neutral', icon, className = '' }) {
  return (
    <span className={`${styles.tag} ${styles[tone]} ${className}`}>
      {icon && <Icon name={icon} size={13} strokeWidth={2} />}
      {children}
    </span>
  )
}

/** Convenience wrapper for the dietary/heat flags on a product. */
export function ProductTags({ item }) {
  return (
    <>
      {item.popular && <Tag tone="warm" icon="star">Popular</Tag>}
      {item.spicy && <Tag tone="danger" icon="chilli">Spicy</Tag>}
      {item.vegetarian && <Tag tone="success" icon="leaf">Vegetarian</Tag>}
    </>
  )
}
