import { AppImage } from '@/components/AppImage/AppImage'
import { Button } from '@/components/Button/Button'
import { Icon } from '@/components/Icon/Icon'
import { restaurant, orderSettings } from '@/config/restaurant'
import { branches } from '@/data/branches'
import { formatPrice } from '@/utils/money'
import styles from './Hero.module.css'

/** Three short promises along the bottom of the hero. */
const heroHighlights = [
  { icon: 'flame', label: 'Cooked to order' },
  { icon: 'truck', label: `Free delivery over ${formatPrice(orderSettings.freeDeliveryAbove)}` },
  { icon: 'clock', label: `${orderSettings.deliveryTime} average` },
  { icon: 'pin', label: `${branches.length} branches` },
]

/**
 * Full-bleed opening shot: the photograph fills the screen, a dark scrim keeps
 * the type readable, and everything sits on top.
 */
export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.backdrop}>
        <AppImage
          src="/assets/images/hero/hero-main.svg"
          alt=""
          ratio="none"
          loading="eager"
          className={styles.image}
        />
        <div className={styles.scrim} />
      </div>

      <div className={`page-container ${styles.inner}`}>
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          {restaurant.tagline}
        </p>

        <h1 id="hero-title" className={styles.title}>
          Big flavour,
          <br />
          <span className={styles.titleAccent}>straight off the grill.</span>
        </h1>

        <p className={styles.description}>{restaurant.description}</p>

        <div className={styles.actions}>
          <Button to="/menu" size="lg" iconAfter="arrowRight">
            Order now
          </Button>
          <Button to="/offers" size="lg" variant="glass">
            See this week&rsquo;s offers
          </Button>
        </div>

        <ul className={styles.highlights}>
          {heroHighlights.map((highlight) => (
            <li key={highlight.label} className={styles.highlight}>
              <Icon name={highlight.icon} size={17} />
              {highlight.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
