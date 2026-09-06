import { Link } from 'react-router-dom'
import { AppImage } from '@/components/AppImage/AppImage'
import { Icon } from '@/components/Icon/Icon'
import styles from './OfferCard.module.css'

/**
 * Promotional tile used on the homepage strip and the offers page.
 *
 *   size  'md' | 'lg' — the large variant leads the offers page
 */
export function OfferCard({ offer, size = 'md' }) {
  return (
    <article className={`${styles.card} ${styles[size]}`}>
      <AppImage src={offer.image} alt={offer.title} ratio="wide" className={styles.image} />

      <span className={styles.badge}>{offer.badge}</span>

      <div className={styles.body}>
        <h3 className={styles.title}>{offer.title}</h3>
        <p className={styles.description}>{offer.description}</p>

        {offer.promoCode && (
          <p className={styles.promoCode}>
            Code: <strong>{offer.promoCode}</strong>
          </p>
        )}

        <Link to={offer.linkTo} className={styles.cta}>
          {offer.ctaLabel}
          <Icon name="arrowRight" size={16} />
        </Link>
      </div>
    </article>
  )
}
