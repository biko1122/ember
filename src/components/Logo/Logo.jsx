import { Link } from 'react-router-dom'
import { restaurant } from '@/config/restaurant'
import styles from './Logo.module.css'

/**
 * The brand mark: a drawn ember shape plus the restaurant name from
 * config/restaurant.js. Change the name there and it updates everywhere.
 *
 * To use a real logo file instead, swap the <svg> below for:
 *   <img src="/assets/logo/logo-mark.svg" alt="" className={styles.mark} />
 */
export function Logo({ tone = 'dark', showTagline = false }) {
  return (
    <Link to="/" className={`${styles.logo} ${styles[tone]}`} aria-label={`${restaurant.name} home`}>
      <svg className={styles.mark} viewBox="0 0 32 32" aria-hidden="true">
        <path
          d="M16 3c2 4.2 1.2 6.9-.9 9.2-2.3 2.6-4 4.4-4 7.6A5 5 0 0 0 16 25a5 5 0 0 0 5-5.4c0-1.5-.5-2.7-1.3-3.8 3 1.2 5 4.3 5 7.8C24.7 28 20.8 31 16 31S7.3 28 7.3 23.6c0-3.7 1.8-6.2 4-8.7C14.1 11.5 16.8 8.3 16 3Z"
          fill="currentColor"
        />
      </svg>

      <span className={styles.text}>
        <span className={styles.name}>{restaurant.name}</span>
        {showTagline && <span className={styles.tagline}>{restaurant.tagline}</span>}
      </span>
    </Link>
  )
}
