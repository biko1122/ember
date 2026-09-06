import { useCallback, useState } from 'react'
import { Icon } from '@/components/Icon/Icon'
import styles from './AppImage.module.css'

/**
 * Every photo on the site goes through this component.
 *
 * It holds its own aspect ratio, so the layout never jumps as images arrive;
 * it fades each one in once decoded, so a grid does not flash; and if a file
 * is missing it draws a warm lit panel rather than a broken-image icon.
 *
 *   ratio     'square' | 'wide' | 'portrait' | 'hero' | 'none'
 *   priority  set on the one image above the fold — loads it eagerly and asks
 *             the browser to fetch it ahead of the rest
 *
 * See ASSETS.md for how to drop the restaurant's real photography in.
 */
export function AppImage({
  src,
  alt,
  ratio = 'square',
  className = '',
  loading,
  priority = false,
  placeholderIcon = 'flame',
}) {
  const [status, setStatus] = useState('loading') // loading | ready | failed

  /**
   * A cached image can finish before React attaches `onLoad`, and that event
   * never fires — which would leave the image stuck at opacity 0. Checking
   * `complete` as soon as we get the element covers that case.
   */
  const handleRef = useCallback((element) => {
    if (!element) return
    if (element.complete) {
      setStatus(element.naturalWidth === 0 ? 'failed' : 'ready')
    }
  }, [])

  return (
    <div className={`${styles.frame} ${styles[ratio]} ${className}`} data-status={status}>
      {status === 'failed' ? (
        <div className={styles.placeholder} role="img" aria-label={alt}>
          <Icon name={placeholderIcon} size={28} />
        </div>
      ) : (
        <img
          ref={handleRef}
          className={styles.image}
          src={src}
          alt={alt}
          loading={loading ?? (priority ? 'eager' : 'lazy')}
          fetchPriority={priority ? 'high' : undefined}
          decoding="async"
          onLoad={() => setStatus('ready')}
          onError={() => setStatus('failed')}
        />
      )}
    </div>
  )
}
