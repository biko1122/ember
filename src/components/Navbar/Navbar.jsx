import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Logo } from '@/components/Logo/Logo'
import { Icon } from '@/components/Icon/Icon'
import { MobileMenu } from '@/components/Navbar/MobileMenu'
import { LocationBar } from '@/components/LocationBar/LocationBar'
import { LanguageSwitcher } from '@/components/LanguageSwitcher/LanguageSwitcher'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { orderTypes } from '@/data/orderTypes'
import styles from './Navbar.module.css'

/**
 * Sticky site header.
 *
 * One row, two clusters: the menu button, the wordmark and the order-type tabs
 * on the left, everything else pushed right, and the space between them simply
 * left empty. Both clusters are inset well away from the screen edges, so on a
 * wide monitor the bar reads as one centred band rather than two far-apart
 * corners. Navigation lives entirely behind the menu button at every width — a
 * bar that shows links on a desktop and hides them on a phone has to be learned
 * twice.
 *
 * On the homepage it floats transparently over the hero photograph and only
 * gains a frosted background once you scroll. Every other page has no hero, so
 * the bar is solid from the start.
 */
export function Navbar() {
  const location = useLocation()
  const { itemCount, openCart, orderType, setOrderType } = useCart()
  const { user, isLoggedIn } = useAuth()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

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
          <div className={styles.inner}>
            <div className={styles.lead}>
              <button
                type="button"
                className={styles.hamburger}
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Icon name="menu" size={26} />
              </button>

              <span className={styles.brand}>
                <Logo variant="wordmark" />
              </span>

              {/* How the order arrives changes prices and delivery times, so it
                  sits with the brand rather than among the account controls.
                  Narrow bars drop it — the menu panel carries the same tabs. */}
              <div className={styles.modes} role="radiogroup" aria-label="Order type">
                {orderTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    role="radio"
                    aria-checked={type.id === orderType}
                    className={styles.mode}
                    data-selected={type.id === orderType}
                    onClick={() => setOrderType(type.id)}
                  >
                    <Icon name={type.icon} size={17} />
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.actions}>
              <LocationBar />

              <LanguageSwitcher />

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

              <NavLink to={isLoggedIn ? '/account' : '/login'} className={styles.iconButton}>
                <Icon name="user" size={21} />
                <span className={styles.accountLabel}>
                  {isLoggedIn ? user.firstName : 'Log in'}
                </span>
              </NavLink>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  )
}
