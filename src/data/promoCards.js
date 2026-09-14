/**
 * The homepage promotional cards.
 *
 * THIS IS THE ONLY FILE YOU NEED TO TOUCH to add, remove or reorder a card.
 * The grid takes two per row on a wide screen and one on a phone, so an even
 * number of cards lands tidily — but any number works.
 *
 *   id           unique, and the React key
 *   layout       how the card is built. Three to choose from:
 *
 *                  'overlay'  photograph filling the card, type over a scrim.
 *                             The loudest of the three — use it for food.
 *                  'split'    type on the left, a cut-out dish on the right,
 *                             on a tinted panel.
 *                  'plain'    mostly typographic, with a small cut-out in the
 *                             corner. The quiet one.
 *
 *   eyebrow      small line above the headline
 *   title        the headline — two or three words carries best
 *   description  one sentence
 *   note         optional extra line under the description (a condition, a
 *                code, a time window)
 *   image        'overlay' wants a photo that fills the frame; 'split' and
 *                'plain' want a cut-out on transparency
 *   imageAlt     what the picture shows, for anyone who cannot see it
 *   cta          { label, to } — the button, and where the whole card goes
 *   accent       optional CSS colour for this card's tint, eyebrow and button
 *                glow; leave it out and the card uses the brand orange
 *   tall         optional — gives the card a taller frame on a wide screen,
 *                so a row of two does not read as two identical boxes
 *
 * Swapping in a real photograph is a one-line change: point `image` at your
 * file. See ASSETS.md for the sizes.
 */
export const promoCards = [
  {
    id: 'crowd-favourite',
    layout: 'overlay',
    eyebrow: 'Crowd favourite',
    title: 'The Double Crispy Stack',
    description:
      'Two buttermilk-fried fillets, melted cheese and smoked mayo in a toasted brioche bun. The one people come back for.',
    note: 'EGP 189, down from EGP 219',
    image: '/assets/images/products/burger-double-stack.svg',
    imageAlt: 'A double fried-chicken burger',
    cta: { label: 'Order now', to: '/menu/double-crispy-stack' },
    tall: true,
  },
  {
    id: 'pickup',
    layout: 'overlay',
    eyebrow: 'Skip the wait',
    title: 'Order ahead, collect in 15',
    description:
      'Pick your branch, pay online and walk straight to the counter. Six branches across the city, open late.',
    image: '/assets/images/restaurant/branch-zamalek.svg',
    imageAlt: 'The lit storefront of an EMBER branch at night',
    cta: { label: 'Find a branch', to: '/branches' },
    accent: '#ffc24d',
    tall: true,
  },
  {
    id: 'rewards',
    layout: 'split',
    eyebrow: 'EMBER Rewards',
    title: 'Every order earns you free food',
    description:
      'Collect a point for every EGP you spend and turn them into sides, desserts and whole meals.',
    note: '200 points just for joining',
    image: '/assets/images/promo/promo-rewards.svg',
    imageAlt: 'A brownie sundae',
    cta: { label: 'Join rewards', to: '/signup' },
    accent: '#ffc24d',
  },
  {
    id: 'family',
    layout: 'plain',
    eyebrow: 'Feeding everyone',
    title: 'Family meals, one price',
    description:
      'Buckets, mixed grills and pizza bundles built for four or more — priced so nobody has to do the maths.',
    image: '/assets/images/promo/promo-family.svg',
    imageAlt: 'A family box of grilled chicken and sides',
    cta: { label: 'View the menu', to: '/menu?category=family' },
  },
]
