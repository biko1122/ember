import { Link } from 'react-router-dom'
import { Hero } from '@/components/Hero/Hero'
import { SectionHeader } from '@/components/SectionHeader/SectionHeader'
import { OrderTypeSelector } from '@/components/OrderTypeSelector/OrderTypeSelector'
import { CategoryTiles } from '@/components/CategoryTiles/CategoryTiles'
import { ProductGrid } from '@/components/ProductGrid/ProductGrid'
import { OfferCard } from '@/components/OfferCard/OfferCard'
import { AppImage } from '@/components/AppImage/AppImage'
import { Button } from '@/components/Button/Button'
import { Icon } from '@/components/Icon/Icon'
import { useAuth } from '@/context/AuthContext'
import { useLoyalty } from '@/context/LoyaltyContext'
import { formatPoints } from '@/components/Loyalty/Loyalty'
import { loyaltySettings } from '@/config/restaurant'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { getFeaturedItems, getPopularItems } from '@/data/menu'
import { offers } from '@/data/offers'
import { branches } from '@/data/branches'
import { restaurant } from '@/config/restaurant'
import styles from './Home.module.css'

/** Short list of what makes the place worth ordering from. */
const promises = [
  {
    icon: 'flame',
    title: 'Cooked to order',
    description: 'Nothing sits under a heat lamp. Your food starts when your order lands.',
  },
  {
    icon: 'leaf',
    title: 'Fresh every morning',
    description: 'Produce and chicken arrive daily and are prepped in-house, never frozen.',
  },
  {
    icon: 'clock',
    title: 'Quick, not rushed',
    description: 'Most deliveries land in under 45 minutes without cutting a single corner.',
  },
]

export function Home() {
  const { isLoggedIn } = useAuth()
  const { balance, nextReward, isLoading: isLoyaltyLoading } = useLoyalty()

  useDocumentTitle(
    null,
    `Order burgers, fried chicken, pizza and family meals from ${restaurant.name}. Delivery, pickup or dine in.`,
  )

  const featuredItems = getFeaturedItems().slice(0, 8)
  const popularItems = getPopularItems().slice(0, 4)
  const highlightedOffers = offers.slice(0, 3)

  return (
    <>
      <Hero />

      {/* Order type ------------------------------------------------------ */}
      <section className={`page-container ${styles.section}`} aria-labelledby="order-type-title">
        <SectionHeader
          id="order-type-title"
          eyebrow="Start here"
          title="How would you like your order?"
          description="Pick one now and we will keep it in mind all the way to checkout."
        />
        <OrderTypeSelector />
      </section>

      {/* Categories ------------------------------------------------------ */}
      <section className={`page-container ${styles.section}`} aria-labelledby="categories-title">
        <SectionHeader
          id="categories-title"
          eyebrow="Browse"
          title="What are you in the mood for?"
          linkTo="/menu"
          linkLabel="See the full menu"
        />
        <CategoryTiles />
      </section>

      {/* Featured -------------------------------------------------------- */}
      <section className={`page-container ${styles.section}`} aria-labelledby="featured-title">
        <SectionHeader
          id="featured-title"
          eyebrow="Featured"
          title="This week's favourites"
          description="The plates coming out of our kitchen most often right now."
          linkTo="/menu"
          linkLabel="View all"
        />
        <ProductGrid items={featuredItems} />
      </section>

      {/* Offers ---------------------------------------------------------- */}
      <section className={`page-container ${styles.section}`} aria-labelledby="offers-title">
        <SectionHeader
          id="offers-title"
          eyebrow="Deals"
          title="Offers worth ordering for"
          linkTo="/offers"
          linkLabel="All offers"
        />

        <ul className={styles.offerGrid}>
          {highlightedOffers.map((offer) => (
            <li key={offer.id}>
              <OfferCard offer={offer} />
            </li>
          ))}
        </ul>
      </section>

      {/* Rewards --------------------------------------------------------- */}
      <section className={`page-container ${styles.section}`} aria-labelledby="rewards-title">
        <div className={styles.rewardsBand}>
          <div className={styles.rewardsText}>
            <p className={styles.rewardsEyebrow}>
              <Icon name="gift" size={15} />
              {loyaltySettings.programName}
            </p>

            <h2 id="rewards-title" className={styles.rewardsTitle}>
              {isLoggedIn && !isLoyaltyLoading
                ? `You have ${formatPoints(balance)} points waiting`
                : 'Every order earns you free food'}
            </h2>

            <p className={styles.rewardsBody}>
              {isLoggedIn && !isLoyaltyLoading
                ? nextReward
                  ? `Just ${formatPoints(nextReward.cost - balance)} more points and ${nextReward.name.toLowerCase()} is yours.`
                  : 'Every reward on the board is unlocked — go and spend them.'
                : `Collect ${loyaltySettings.pointsPerEgp} point for every EGP you spend, and start with ${formatPoints(loyaltySettings.joiningBonus)} points just for joining.`}
            </p>
          </div>

          <div className={styles.rewardsActions}>
            <Button to="/rewards" iconAfter="arrowRight">
              {isLoggedIn ? 'Spend my points' : 'See how it works'}
            </Button>
            {!isLoggedIn && (
              <Link to="/signup" className={styles.rewardsLink}>
                Join in 30 seconds
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Promises + story ------------------------------------------------ */}
      <section className={styles.storyBand} aria-labelledby="story-title">
        <div className={`page-container ${styles.storyInner}`}>
          <AppImage
            src="/assets/images/restaurant/restaurant-kitchen.svg"
            alt="The open kitchen at our Zamalek branch"
            ratio="wide"
            className={styles.storyImage}
          />

          <div className={styles.storyText}>
            <p className={styles.storyEyebrow}>Since {restaurant.foundedYear}</p>
            <h2 id="story-title" className={styles.storyTitle}>
              One grill, one obsession
            </h2>
            <p className={styles.storyBody}>
              {restaurant.name} started as a single counter with three stools and a charcoal grill
              that never quite cooled down. We still cook the same way: short menu, proper
              ingredients, everything made when you order it.
            </p>

            <ul className={styles.promises}>
              {promises.map((promise) => (
                <li key={promise.title} className={styles.promise}>
                  <span className={styles.promiseIcon}>
                    <Icon name={promise.icon} size={20} />
                  </span>
                  <div>
                    <h3 className={styles.promiseTitle}>{promise.title}</h3>
                    <p className={styles.promiseText}>{promise.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Button to="/about" variant="outline" iconAfter="arrowRight">
              Read our story
            </Button>
          </div>
        </div>
      </section>

      {/* Popular --------------------------------------------------------- */}
      <section className={`page-container ${styles.section}`} aria-labelledby="popular-title">
        <SectionHeader
          id="popular-title"
          eyebrow="Most ordered"
          title="Everyone's ordering these"
          linkTo="/menu"
          linkLabel="View all"
        />
        <ProductGrid items={popularItems} />
      </section>

      {/* Branches -------------------------------------------------------- */}
      <section className={`page-container ${styles.section}`} aria-labelledby="branches-title">
        <div className={styles.branchBand}>
          <div>
            <h2 id="branches-title" className={styles.branchTitle}>
              {branches.length} branches, one standard
            </h2>
            <p className={styles.branchText}>
              Find your closest kitchen, check opening hours, or order ahead and skip the queue.
            </p>
          </div>

          <div className={styles.branchActions}>
            <Button to="/branches" variant="secondary" iconAfter="arrowRight">
              Find a branch
            </Button>
            <Link to="/menu" className={styles.branchLink}>
              Or start your order
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
