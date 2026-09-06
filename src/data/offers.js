/**
 * Promotional offers shown on the homepage carousel and the /offers page.
 *
 *   badge      short label printed over the image, e.g. "20% OFF"
 *   linkTo     where the CTA goes — a menu category, a product, or /menu
 *   promoCode  optional — surfaced so the customer can copy it into checkout
 */
export const offers = [
  {
    id: 'weekend-family-feast',
    title: 'Weekend Family Feast',
    description:
      'Our 10-piece bucket with fries, coleslaw and a large drink — EGP 100 off, every Friday and Saturday.',
    badge: 'SAVE EGP 100',
    image: '/assets/images/offers/offer-family-feast.svg',
    ctaLabel: 'Order the bucket',
    linkTo: '/menu/family-feast-bucket',
  },
  {
    id: 'two-for-one-burgers',
    title: 'Buy One, Get One Burger',
    description:
      'Order any signature burger between 2pm and 5pm and the second one is on us.',
    badge: 'BUY 1 GET 1',
    image: '/assets/images/offers/offer-bogo-burger.svg',
    ctaLabel: 'Browse burgers',
    linkTo: '/menu?category=burgers',
  },
  {
    id: 'ten-percent-first-order',
    title: '10% Off Your First Order',
    description:
      'New to EMBER? Use code EMBER10 at checkout and take 10% off anything on the menu.',
    badge: '10% OFF',
    image: '/assets/images/offers/offer-first-order.svg',
    ctaLabel: 'Start ordering',
    linkTo: '/menu',
    promoCode: 'EMBER10',
  },
  {
    id: 'free-delivery',
    title: 'Free Delivery Over EGP 350',
    description:
      'Spend EGP 350 or more and we will drop the delivery fee automatically. No code needed.',
    badge: 'FREE DELIVERY',
    image: '/assets/images/offers/offer-free-delivery.svg',
    ctaLabel: 'Fill your basket',
    linkTo: '/menu',
  },
  {
    id: 'pizza-night-bundle',
    title: 'Pizza Night Bundle',
    description:
      'Two large stone-baked pizzas, garlic flatbread, wings and a big drink for one flat price.',
    badge: 'SAVE EGP 75',
    image: '/assets/images/offers/offer-pizza-night.svg',
    ctaLabel: 'See the bundle',
    linkTo: '/menu/family-pizza-night',
  },
  {
    id: 'student-lunch',
    title: 'Student Lunch Deal',
    description:
      'Any strips meal for EGP 50 less, weekdays before 4pm. Show a valid student ID in store.',
    badge: 'SAVE EGP 50',
    image: '/assets/images/offers/offer-student-lunch.svg',
    ctaLabel: 'View meals',
    linkTo: '/menu?category=meals',
  },
]

export function getOfferById(offerId) {
  return offers.find((offer) => offer.id === offerId)
}
