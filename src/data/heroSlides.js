/**
 * The homepage hero slider.
 *
 * THIS IS THE ONLY FILE YOU NEED TO TOUCH to add, remove or reorder a slide —
 * the component renders whatever is in this array, in this order. Two slides
 * or ten, it behaves the same; with one, the arrows and dots take themselves
 * away.
 *
 *   id           unique, and the React key
 *   eyebrow      small line above the headline
 *   title        the headline — keep it to about four words so it stays on two
 *                lines at phone width
 *   description  one sentence
 *   price        optional number — rendered through formatPrice()
 *   oldPrice     optional number, struck through next to `price`
 *   priceNote    optional line under the price, or instead of one (a promo
 *                code, a condition, a time window)
 *   badge        optional flash printed over the artwork
 *   image        cut-out artwork, drawn by scripts/generate-artwork.mjs
 *   imageAlt     what the food is, for anyone who cannot see it
 *   cta          { label, to } — the primary button
 *   secondaryCta optional { label, to } — a quieter second button
 *   accent       optional CSS colour for this slide's glow and badge; leave it
 *                out and the slide uses the brand orange
 *
 * Swapping the artwork for a real photograph is a one-line change: point
 * `image` at your file. A cut-out PNG on transparency suits the layout best —
 * see ASSETS.md.
 */
export const heroSlides = [
  {
    id: 'family-feast',
    eyebrow: 'Friday & Saturday only',
    title: 'The Family Feast, EGP 104 off',
    description:
      'Ten pieces of our buttermilk-fried chicken with fries, coleslaw and a large drink — enough for four, priced for one weekend.',
    price: 795,
    oldPrice: 899,
    badge: 'Weekend deal',
    image: '/assets/images/hero/slide-family-feast.svg',
    imageAlt: 'A family bucket of fried chicken with sides',
    cta: { label: 'Order the feast', to: '/menu/family-feast-bucket' },
    secondaryCta: { label: 'See all offers', to: '/offers' },
  },
  {
    id: 'double-stack',
    eyebrow: 'Signature burger',
    title: 'Double Crispy Stack',
    description:
      'Two buttermilk-fried chicken fillets, melted cheese and smoked mayo in a toasted brioche bun.',
    price: 189,
    oldPrice: 219,
    badge: 'Save EGP 30',
    image: '/assets/images/hero/slide-double-stack.svg',
    imageAlt: 'A double fried-chicken burger',
    cta: { label: 'Add to basket', to: '/menu/double-crispy-stack' },
    secondaryCta: { label: 'Browse burgers', to: '/menu?category=burgers' },
  },
  {
    id: 'hot-wings',
    eyebrow: 'Turn the heat up',
    title: 'Hot Wings, eight pieces',
    description:
      'Marinated overnight, fried to order and tossed in our own chilli glaze. Cooling dip on the side, if you need it.',
    price: 175,
    oldPrice: 195,
    badge: 'Fiery',
    image: '/assets/images/hero/slide-hot-wings.svg',
    imageAlt: 'A pile of glazed hot chicken wings',
    cta: { label: 'Order the wings', to: '/menu/hot-wings-8' },
    accent: '#ff3d2e',
  },
  {
    id: 'pizza-night',
    eyebrow: 'Bundle',
    title: 'Pizza Night, sorted',
    description:
      'Two large stone-baked pizzas, garlic flatbread, a plate of wings and a big drink for one flat price.',
    price: 645,
    oldPrice: 720,
    badge: 'Save EGP 75',
    image: '/assets/images/hero/slide-pizza-night.svg',
    imageAlt: 'A stone-baked pepperoni pizza',
    cta: { label: 'See the bundle', to: '/menu/family-pizza-night' },
    accent: '#ffc24d',
  },
  {
    id: 'first-order',
    eyebrow: 'New here?',
    title: 'Ten per cent off your first order',
    description:
      'Anything on the menu, any branch, delivery or pickup. One code, used once — welcome to EMBER.',
    priceNote: 'Use code EMBER10 at checkout',
    badge: '10% off',
    image: '/assets/images/hero/slide-crispy-strips.svg',
    imageAlt: 'A tray of crispy chicken strips with fries and a drink',
    cta: { label: 'Start your order', to: '/menu' },
    secondaryCta: { label: 'How rewards work', to: '/rewards' },
  },
]
