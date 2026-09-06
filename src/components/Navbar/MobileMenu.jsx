import { NavLink } from 'react-router-dom'
import { Logo } from '@/components/Logo/Logo'
import { Icon } from '@/components/Icon/Icon'
import { Button } from '@/components/Button/Button'
import { OrderTypeSelector } from '@/components/OrderTypeSelector/OrderTypeSelector'
import { Avatar } from '@/components/Avatar/Avatar'
import { useAuth } from '@/context/AuthContext'
import { useLoyalty } from '@/context/LoyaltyContext'
import { formatPoints } from '@/components/Loyalty/Loyalty'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { primaryNavLinks } from '@/data/navigation'
import styles from './MobileMenu.module.css'

/**
 * Full-height slide-in navigation for small screens.
 */
export function MobileMenu({ isOpen, onClose }) {
  const { user, isLoggedIn, logout } = useAuth()
  const { balance, tier, isLoading: isLoyaltyLoading } = useLoyalty()

  useBodyScrollLock(isOpen)

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <Logo />
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close menu">
            <Icon name="close" size={22} />
          </button>
        </div>

        {isLoggedIn && (
          <NavLink to="/account" onClick={onClose} className={styles.memberCard}>
            <Avatar user={user} size="md" />
            <span className={styles.memberText}>
              <span className={styles.memberName}>{user.firstName} {user.lastName}</span>
              <span className={styles.memberPoints}>
                {isLoyaltyLoading ? 'Loading your points…' : `${formatPoints(balance)} points · ${tier.name}`}
              </span>
            </span>
            <Icon name="chevronRight" size={18} />
          </NavLink>
        )}

        <div className={styles.section}>
          <p className={styles.sectionTitle}>Your order</p>
          <OrderTypeSelector layout="stacked" compact onSelect={onClose} />
        </div>

        <nav className={styles.nav} aria-label="Mobile">
          {primaryNavLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
              }
            >
              {link.label}
              <Icon name="chevronRight" size={18} />
            </NavLink>
          ))}
        </nav>

        <div className={styles.footer}>
          {isLoggedIn ? (
            <>
              <p className={styles.greeting}>Signed in as {user.firstName}</p>
              <Button to="/account" variant="outline" fullWidth onClick={onClose}>
                My account
              </Button>
              <Button
                variant="ghost"
                fullWidth
                onClick={async () => {
                  await logout()
                  onClose()
                }}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button to="/login" variant="primary" fullWidth onClick={onClose}>
                Log in
              </Button>
              <Button to="/signup" variant="outline" fullWidth onClick={onClose}>
                Create account
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
