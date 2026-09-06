import { PageHeader } from '@/components/PageHeader/PageHeader'
import { OfferCard } from '@/components/OfferCard/OfferCard'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { offers } from '@/data/offers'
import { promoCodes } from '@/config/restaurant'
import styles from './Offers.module.css'

/** All current deals — the first one gets the wide treatment. */
export function Offers() {
  useDocumentTitle('Offers', 'Current deals, bundles and promo codes.')

  const [featuredOffer, ...otherOffers] = offers

  return (
    <>
      <PageHeader
        eyebrow="Deals"
        title="Offers on right now"
        description="Bundles, discounts and codes worth knowing about. No small print games."
      />

      <div className={`page-container ${styles.page}`}>
        <div className={styles.featured}>
          <OfferCard offer={featuredOffer} size="lg" />
        </div>

        <ul className={styles.grid}>
          {otherOffers.map((offer) => (
            <li key={offer.id}>
              <OfferCard offer={offer} />
            </li>
          ))}
        </ul>

        <section className={styles.codes} aria-labelledby="promo-codes-title">
          <h2 id="promo-codes-title" className={styles.codesTitle}>
            Promo codes you can use today
          </h2>

          <ul className={styles.codeList}>
            {promoCodes.map((promo) => (
              <li key={promo.code} className={styles.code}>
                <span className={styles.codeName}>{promo.code}</span>
                <span className={styles.codeDescription}>{promo.description}</span>
              </li>
            ))}
          </ul>

          <p className={styles.codeNote}>Enter a code in your basket before checking out.</p>
        </section>
      </div>
    </>
  )
}
