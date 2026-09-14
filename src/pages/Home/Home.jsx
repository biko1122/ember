import { Link } from 'react-router-dom'
import { Rail, RailItem } from '@/components/Rail/Rail'
import { OfferCard } from '@/components/OfferCard/OfferCard'
import { ProductCard } from '@/components/ProductCard/ProductCard'
import { CategoryTile, getBrowsableCategories } from '@/components/CategoryTiles/CategoryTiles'
import { AppImage } from '@/components/AppImage/AppImage'
import { Button } from '@/components/Button/Button'
import { Icon } from '@/components/Icon/Icon'
import { useAuth } from '@/context/AuthContext'
import { useLoyalty } from '@/context/LoyaltyContext'
import { formatPoints } from '@/components/Loyalty/Loyalty'
import { loyaltySettings, restaurant } from '@/config/restaurant'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { getFeaturedItems, getPopularItems } from '@/data/menu'
import { offers } from '@/data/offers'
import { branches } from '@/data/branches'
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

/**
 * The homepage follows the pattern the big delivery chains use: no headline to
 * read past, just the things a returning customer came for — today's offers,
 * the categories, the loyalty programme, and the deals — each as a scrollable
 * rail. Where the order is going is settled up in the header before any of it.
 */
export function Home() {
  const { isLoggedIn } = useAuth()
  const { balance, nextReward, isLoading: isLoyaltyLoading } = useLoyalty()

  useDocumentTitle(
    null,
    `Order burgers, fried chicken, pizza and family meals from ${restaurant.name}. Delivery, pickup or dine in.`,
  )

  const featuredItems = getFeaturedItems().slice(0, 10)
  const popularItems = getPopularItems().slice(0, 8)
  const categories = getBrowsableCategories()

  return (
    <div className={`page-container ${styles.page}`}>
      {/* Offers ---------------------------------------------------------- */}
      <Rail
        id="offers-title"
        eyebrow="On right now"
        title="Exclusive offers"
        viewAllTo="/offers"
      >
        {offers.map((offer) => (
          <RailItem key={offer.id} width="340px">
            <OfferCard offer={offer} />
          </RailItem>
        ))}
      </Rail>

      {/* Categories ------------------------------------------------------ */}
      <Rail
        id="categories-title"
        eyebrow="Browse"
        title="Explore the menu"
        viewAllTo="/menu"
      >
        {categories.map((category) => (
          <RailItem key={category.id} width="190px">
            <CategoryTile category={category} />
          </RailItem>
        ))}
      </Rail>

      {/* Rewards --------------------------------------------------------- */}
      <section className={styles.rewardsBand} aria-labelledby="rewards-title">
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
      </section>

      {/* Top deals ------------------------------------------------------- */}
      <Rail
        id="featured-title"
        eyebrow="Top deals"
        title="This week's favourites"
        viewAllTo="/menu"
      >
        {featuredItems.map((item) => (
          <RailItem key={item.id} width="280px">
            <ProductCard item={item} />
          </RailItem>
        ))}
      </Rail>

      {/* Most ordered ---------------------------------------------------- */}
      <Rail
        id="popular-title"
        eyebrow="Most ordered"
        title="Everyone's ordering these"
        viewAllTo="/menu"
      >
        {popularItems.map((item) => (
          <RailItem key={item.id} width="280px">
            <ProductCard item={item} />
          </RailItem>
        ))}
      </Rail>

      {/* Story ----------------------------------------------------------- */}
      <section className={styles.storyBand} aria-labelledby="story-title">
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
      </section>

      {/* Branches -------------------------------------------------------- */}
      <section className={styles.section} aria-labelledby="branches-title">
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
    </div>
  )
}
