import { Link } from 'react-router-dom'
import { AppImage } from '@/components/AppImage/AppImage'
import { Logo } from '@/components/Logo/Logo'
import { restaurant } from '@/config/restaurant'
import styles from './AuthLayout.module.css'

/**
 * Split-screen frame shared by the login and sign-up pages: photography on one
 * side, the form on the other.
 */
export function AuthLayout({ title, subtitle, image, imageAlt, children, footer }) {
  return (
    <div className={styles.layout}>
      <aside className={styles.aside}>
        <AppImage src={image} alt={imageAlt} ratio="none" className={styles.image} />
        <div className={styles.asideOverlay}>
          <Logo tone="light" />
          <p className={styles.asideText}>{restaurant.tagline}</p>
        </div>
      </aside>

      <main className={styles.formSide}>
        <div className={styles.formInner}>
          <header className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{subtitle}</p>
          </header>

          {children}

          {footer && <div className={styles.footer}>{footer}</div>}

          <Link to="/menu" className={styles.guestLink}>
            Continue as guest
          </Link>
        </div>
      </main>
    </div>
  )
}
