import styles from './Skeleton.module.css'

/**
 * The grey shape shown while something is loading.
 *
 * Always give the skeleton the same proportions as the thing it replaces —
 * that is the whole point, so the page does not jump when the content lands.
 *
 *   shape   'text' | 'title' | 'block' | 'circle'
 */
export function Skeleton({ shape = 'text', width, height, className = '', style }) {
  return (
    <span
      className={`${styles.skeleton} ${styles[shape]} ${className}`}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  )
}

/** A few lines of fake copy. `lines` sets how many. */
export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <span className={`${styles.stack} ${className}`} aria-hidden="true">
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          // The last line stops short, the way a real paragraph does.
          width={index === lines - 1 ? '62%' : '100%'}
        />
      ))}
    </span>
  )
}

/**
 * Wraps a loading region so screen readers are told something is happening
 * rather than being read an empty box.
 */
export function LoadingRegion({ label = 'Loading', children, className = '' }) {
  return (
    <div className={className} role="status" aria-live="polite" aria-busy="true">
      <span className="visually-hidden">{label}</span>
      {children}
    </div>
  )
}
