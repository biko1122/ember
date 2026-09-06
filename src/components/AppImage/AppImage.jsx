import { useState } from 'react'
import { Icon } from '@/components/Icon/Icon'
import styles from './AppImage.module.css'

/**
 * Every photo on the site goes through this component.
 *
 * If the file is missing — which it will be until you drop your own photos into
 * /public/assets/images — it draws a tidy placeholder instead of a broken image
 * icon, so the layout always looks intentional. See ASSETS.md for the list of
 * files to add.
 *
 *   ratio   'square' | 'wide' | 'portrait' | 'hero' | 'none'
 */
export function AppImage({
  src,
  alt,
  ratio = 'square',
  className = '',
  loading = 'lazy',
  placeholderIcon = 'flame',
}) {
  const [hasFailed, setHasFailed] = useState(false)

  return (
    <div className={`${styles.frame} ${styles[ratio]} ${className}`} data-empty={hasFailed}>
      {hasFailed ? (
        <div className={styles.placeholder} role="img" aria-label={alt}>
          <Icon name={placeholderIcon} size={28} />
        </div>
      ) : (
        <img
          className={styles.image}
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          onError={() => setHasFailed(true)}
        />
      )}
    </div>
  )
}
