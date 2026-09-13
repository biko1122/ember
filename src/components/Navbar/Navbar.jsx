import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Logo } from '@/components/Logo/Logo'
import { Icon } from '@/components/Icon/Icon'
import { Modal } from '@/components/Modal/Modal'
import { OrderTypeSelector } from '@/components/OrderTypeSelector/OrderTypeSelector'
import { MobileMenu } from '@/components/Navbar/MobileMenu'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useLoyalty } from '@/context/LoyaltyContext'
import { formatPoints } from '@/components/Loyalty/Loyalty'
import { primaryNavLinks } from '@/data/navigation'
import { getOrderType } from '@/data/orderTypes'
import styles from './Navbar.module.css'

/**
 * Sticky site header.
 *
 * On the homepage it floats transparently over the hero photograph and only
 * gains a frosted background once you scroll. Every other page has no hero, so
 * the bar is solid from the start.
 */
export function Navbar() {
  const location = useLocation()
  const { itemCount, openCart, orderType } = useCart()
  const { user, isLoggedIn } = useAuth()
  const { balance, isLoading: isLoyaltyLoading } = useLoyalty()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isOrderTypeModalOpen, setIsOrderTypeModalOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  const activeOrderType = getOrderType(orderType)
  const isOverHero = location.pathname === '/'

  /**
   * Compact the bar once the page moves.
   *
   * The two thresholds are deliberate: compacting and expanding at the same
   * scroll position makes the bar flicker when someone rests mid-gesture, so
   * it shrinks at 24px and only grows back at 6px.
   *
   * The flag is mirrored onto <html> because `--navbar-offset` lives there —
   * that is what lets the menu's category bar and every sticky sidebar keep
   * hugging the header as it shrinks, without each of them knowing why.
   */
  useEffect(() => {
    const COMPACT_BELOW = 24
    const EXPAND_ABOVE = 6
    let isCompact = false

    const handleScroll = () => {
      const y = window.scrollY
      const next = isCompact ? y > EXPAND_ABOVE : y > COMPACT_BELOW
      if (next === isCompact) return

      isCompact = next
      setHasScrolled(next)
      document.documentElement.dataset.navCompact = String(next)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      delete document.documentElement.dataset.navCompact
    }
  }, [])

  // Any navigation closes the mobile menu.
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <>
      <header
        className={styles.navbar}
        data-scrolled={hasScrolled}
        data-solid={!isOverHero}
      >
        {/* The <header> reserves a constant height; only this bar inside it
            resizes, so compacting never shifts the page behind it. */}
        <div className={styles.bar}>
          <div className={`page-container ${styles.inner}`}>
            <button
              type="button"
              className={styles.hamburger}
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Icon name="menu" size={24} />
            </button>

            <span className={styles.brand}>
              <Logo />
            </span>

            <nav className={styles.links} aria-label="Main">
              {primaryNavLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.linkActive}` : styles.link
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.orderTypeChip}
                onClick={() => setIsOrderTypeModalOpen(true)}
              >
                <Icon name={activeOrderType.icon} size={17} />
                <span>{activeOrderType.label}</span>
                <Icon name="chevronDown" size={15} />
              </button>

              {isLoggedIn && !isLoyaltyLoading && (
                <NavLink to="/rewards" className={styles.pointsChip} title="Ember Rewards">
                  <Icon name="gift" size={16} />
                  <span>{formatPoints(balance)}</span>
                  <span className="visually-hidden">points</span>
                </NavLink>
              )}

              <NavLink to={isLoggedIn ? '/account' : '/login'} className={styles.iconButton}>
                <Icon name="user" size={21} />
                <span className={styles.accountLabel}>
                  {isLoggedIn ? user.firstName : 'Log in'}
                </span>
              </NavLink>

              <button
                type="button"
                className={styles.cartButton}
                onClick={openCart}
                aria-label={`Open basket, ${itemCount} item${itemCount === 1 ? '' : 's'}`}
              >
                <Icon name="cart" size={21} />
                {itemCount > 0 && (
                  <span key={itemCount} className={styles.cartBadge}>
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <Modal
        isOpen={isOrderTypeModalOpen}
        onClose={() => setIsOrderTypeModalOpen(false)}
        title="How would you like your order?"
      >
        <div className={styles.orderTypeModalBody}>
          <h2 className={styles.orderTypeModalTitle}>How would you like your order?</h2>
          <OrderTypeSelector layout="stacked" onSelect={() => setIsOrderTypeModalOpen(false)} />
        </div>
      </Modal>
    </>
  )
}
