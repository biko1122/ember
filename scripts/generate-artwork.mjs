/**
 * Generates every image the site references.
 *
 *   node scripts/generate-artwork.mjs
 *
 * -------------------------------------------------------------------------
 * WHY THIS EXISTS
 * The prototype needs to look photographed before the restaurant's real
 * photography exists. Rather than shipping grey boxes, this writes a piece of
 * bespoke artwork for every slot, drawn in the EMBER palette.
 *
 * REPLACING ONE WITH A REAL PHOTO
 * Drop your photo into the same folder and point the matching `image` value in
 * src/data/*.js at it. Nothing else changes. See ASSETS.md.
 * -------------------------------------------------------------------------
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { cutout, frame, seeded } from './artwork-kit.mjs'
import {
  place,
  burger,
  friedChicken,
  grilledChicken,
  bucket,
  pizza,
  sandwich,
  fries,
  onionRings,
  bowl,
  garlicBread,
  cakeSlice,
  sundae,
  cookie,
  iceCream,
  drink,
  mealTray,
  familyBox,
} from './artwork-dishes.mjs'
import { room, offerBanner } from './artwork-scenes.mjs'

const PUBLIC_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public')

/* -- Canvas sizes ---------------------------------------------------------- */
const WIDE = { width: 1200, height: 750 } // products, offers, story bands, branches
const SQUARE = { width: 600, height: 600 } // category thumbnails
const GALLERY = { width: 800, height: 800 } // About page photo strip
const PORTRAIT = { width: 1200, height: 1600 } // login / signup side panels
const HERO = { width: 1600, height: 1200 } // homepage hero
const SLIDE = { width: 1200, height: 900 } // hero slider — one dish per slide

/* -- Dish renderers, by key ------------------------------------------------ */
const DISHES = {
  burger,
  friedChicken,
  grilledChicken,
  bucket,
  pizza,
  sandwich,
  fries,
  onionRings,
  bowl,
  garlicBread,
  cakeSlice,
  sundae,
  cookie,
  iceCream,
  drink,
  mealTray,
  familyBox,
}

/** How much room each dish needs, relative to a 1200 x 750 card. */
const DISH_SCALE = {
  pizza: 1.02,
  mealTray: 1,
  familyBox: 0.96,
  bucket: 1.12,
  sundae: 1.12,
  iceCream: 1.12,
  drink: 1.14,
  default: 1.2,
}

/**
 * Every product image, keyed by the filename src/data/menu.js asks for.
 * `hue` nudges the background so a grid of cards has warmth variation without
 * any of them leaving the brand palette.
 */
const PRODUCTS = {
  // Burgers
  'burger-double-stack': ['burger', { double: true }, 20],
  'burger-classic': ['burger', {}, 26],
  'burger-smoky-bbq': ['burger', { double: false }, 16],
  'burger-fiery-crunch': ['burger', { spicy: true }, 8],
  'burger-mushroom-swiss': ['burger', {}, 32],
  'burger-halloumi': ['burger', { vegetarian: true }, 40],
  'burger-signature': ['burger', { double: true, spicy: true }, 14],

  // Chicken
  'chicken-crispy-strips': ['friedChicken', { shape: 'strip', count: 4 }, 34],
  'chicken-hot-wings': ['friedChicken', { shape: 'wing', count: 5 }, 10],
  'chicken-popcorn': ['friedChicken', { shape: 'popcorn' }, 36],
  'chicken-grilled-quarter': ['grilledChicken', {}, 26],
  'chicken-crispy-fillets': ['friedChicken', { shape: 'fillet', count: 3 }, 32],
  'chicken-bucket-8': ['bucket', {}, 18],

  // Meals
  'meal-crispy-strips': ['mealTray', { main: 'chicken' }, 30],
  'meal-burger-combo': ['mealTray', { main: 'burger' }, 24],
  'meal-grilled-chicken': ['mealTray', { main: 'grilled' }, 28],
  'meal-wings': ['mealTray', { main: 'wings' }, 12],
  'meal-double-stack': ['mealTray', { main: 'burger' }, 20],
  'meal-two-piece': ['mealTray', { main: 'chicken' }, 34],
  'meal-veggie': ['mealTray', { main: 'veggie' }, 42],

  // Pizza
  'pizza-margherita': ['pizza', { topping: 'basil' }, 14],
  'pizza-pepperoni': ['pizza', { topping: 'pepperoni' }, 8],
  'pizza-bbq-chicken': ['pizza', { topping: 'chicken' }, 24],
  'pizza-four-cheese': ['pizza', { topping: 'cheese' }, 40],
  'pizza-spicy-beef': ['pizza', { topping: 'beef' }, 10],

  // Sandwiches
  'sandwich-crispy-chicken': ['sandwich', { style: 'sub' }, 30],
  'sandwich-grilled-wrap': ['sandwich', { style: 'wrap' }, 36],
  'sandwich-fiery-chicken': ['sandwich', { style: 'sub' }, 8],
  'sandwich-steak-melt': ['sandwich', { style: 'melt' }, 18],
  'sandwich-club': ['sandwich', { style: 'club' }, 34],

  // Sides
  'side-fries': ['fries', {}, 38],
  'side-loaded-fries': ['fries', { loaded: true }, 30],
  'side-onion-rings': ['onionRings', {}, 34],
  'side-coleslaw': ['bowl', { kind: 'coleslaw' }, 44],
  'side-mashed-potato': ['bowl', { kind: 'mash' }, 40],
  'side-garlic-bread': ['garlicBread', {}, 32],

  // Desserts
  'dessert-chocolate-cake': ['cakeSlice', { kind: 'chocolate' }, 350],
  'dessert-cheesecake': ['cakeSlice', { kind: 'cheesecake' }, 344],
  'dessert-brownie-sundae': ['sundae', {}, 348],
  'dessert-cookie': ['cookie', {}, 30],
  'dessert-ice-cream': ['iceCream', {}, 340],

  // Drinks
  'drink-cola': ['drink', { kind: 'cup' }, 12],
  'drink-orange': ['drink', { kind: 'glass', hue: 30 }, 32],
  'drink-lemon-mint': ['drink', { kind: 'glass', hue: 80 }, 60],
  'drink-mango-smoothie': ['drink', { kind: 'glass', hue: 42 }, 38],
  'drink-iced-tea': ['drink', { kind: 'glass', hue: 24 }, 28],
  'drink-water': ['drink', { kind: 'bottle' }, 200],
  'drink-coffee': ['drink', { kind: 'coffee' }, 26],

  // Family meals
  'family-feast-bucket': ['familyBox', { kind: 'bucket' }, 18],
  'family-burger-box': ['familyBox', { kind: 'burgerBox' }, 14],
  'family-mixed-grill': ['familyBox', { kind: 'grill' }, 24],
  'family-pizza-night': ['familyBox', { kind: 'pizza' }, 10],
}

/** One representative dish per category tile. */
const CATEGORIES = {
  'category-featured': ['burger', { double: true }, 18],
  'category-meals': ['mealTray', { main: 'burger' }, 26],
  'category-burgers': ['burger', {}, 22],
  'category-chicken': ['friedChicken', { shape: 'strip', count: 3 }, 34],
  'category-pizza': ['pizza', { topping: 'pepperoni', slicePulled: false }, 10],
  'category-sandwiches': ['sandwich', { style: 'club' }, 30],
  'category-sides': ['fries', {}, 38],
  'category-desserts': ['cakeSlice', { kind: 'chocolate' }, 348],
  'category-drinks': ['drink', { kind: 'cup' }, 14],
  'category-family': ['bucket', {}, 20],
}

/** Offer banners — a flat brand graphic with a small dish on the right. */
const OFFERS = {
  'offer-family-feast': ['bucket', {}, 16],
  'offer-bogo-burger': ['burger', { double: true }, 22],
  'offer-first-order': ['friedChicken', { shape: 'strip', count: 3, dip: false }, 30],
  'offer-free-delivery': ['fries', {}, 36],
  'offer-pizza-night': ['pizza', { topping: 'pepperoni', slicePulled: false }, 10],
  'offer-student-lunch': ['mealTray', { main: 'chicken' }, 28],
}

/**
 * Hero slider — one dish per slide, drawn as a cut-out so it sits on the
 * slide's own gradient. Keys match the `image` paths in data/heroSlides.js;
 * adding a slide there means adding a line here.
 */
const HERO_SLIDES = {
  'slide-family-feast': ['familyBox', { kind: 'bucket' }],
  'slide-double-stack': ['burger', { double: true }],
  'slide-hot-wings': ['friedChicken', { shape: 'wing', count: 5 }],
  'slide-pizza-night': ['pizza', { topping: 'pepperoni' }],
  'slide-crispy-strips': ['mealTray', { main: 'chicken' }],
}

/**
 * Promotional cards — same cut-out treatment as the hero slides, at the size
 * a card needs. Keys match the `image` paths in data/promoCards.js.
 */
const PROMO_CARDS = {
  'promo-rewards': ['sundae', {}],
  'promo-family': ['familyBox', { kind: 'grill' }],
}

/** Rooms — the restaurant itself. */
const ROOMS = {
  'restaurant-kitchen': ['kitchen', WIDE],
  'restaurant-interior': ['dining', WIDE],
  'restaurant-grill': ['grill', GALLERY],
  'restaurant-team': ['team', GALLERY],
  'restaurant-bakery': ['bakery', GALLERY],
  'restaurant-counter': ['counter', PORTRAIT],
  'restaurant-dining': ['dining', PORTRAIT],
  'branch-zamalek': ['storefront', WIDE],
  'branch-new-cairo': ['storefront', WIDE],
  'branch-maadi': ['storefront', WIDE],
  'branch-sheikh-zayed': ['storefront', WIDE],
  'branch-heliopolis': ['storefront', WIDE],
  'branch-alexandria': ['dining', WIDE],
}

/* -- Rendering ------------------------------------------------------------- */

function renderDish(name, [kind, options]) {
  const random = seeded(name)
  return DISHES[kind](random, options)
}

function dishScale(kind, canvas) {
  const base = DISH_SCALE[kind] ?? DISH_SCALE.default
  // Everything is authored against a 1200-wide card.
  return base * (canvas.width / 1200)
}

const files = []
const write = (path, contents) => files.push([path, contents])

// Products — wide cards. The dish sits slightly high because tags overlay the
// bottom-left corner of a product card.
for (const [name, [kind, options, hue]] of Object.entries(PRODUCTS)) {
  const art = renderDish(name, [kind, options])
  const inner = place(art, WIDE.width / 2, WIDE.height * 0.5, dishScale(kind, WIDE))
  write(`assets/images/products/${name}.svg`, frame(WIDE.width, WIDE.height, name, inner, { hue }))
}

// Category thumbnails — square, tighter crop.
for (const [name, [kind, options, hue]] of Object.entries(CATEGORIES)) {
  const art = renderDish(name, [kind, options])
  const inner = place(art, SQUARE.width / 2, SQUARE.height * 0.52, dishScale(kind, SQUARE) * 0.98)
  write(
    `assets/images/categories/${name}.svg`,
    frame(SQUARE.width, SQUARE.height, name, inner, { hue, glow: 0.4 }),
  )
}

// Offers — banner graphic, dish pushed right so the badge corner stays clear.
for (const [name, [kind, options, hue]] of Object.entries(OFFERS)) {
  const random = seeded(`${name}-banner`)
  const art = place(
    renderDish(name, [kind, options]),
    WIDE.width * 0.74,
    WIDE.height * 0.52,
    dishScale(kind, WIDE) * 0.62,
  )
  const inner = offerBanner(random, WIDE.width, WIDE.height, { accent: hue, art })
  write(`assets/images/offers/${name}.svg`, frame(WIDE.width, WIDE.height, name, inner, { hue, glow: 0.2 }))
}

// Hero slides — no ground behind them; the banner supplies its own.
for (const [name, [kind, options]] of Object.entries(HERO_SLIDES)) {
  const art = renderDish(name, [kind, options])
  // Bigger than a card would take it: on the banner the dish is the subject,
  // not an illustration next to a price.
  const inner = place(art, SLIDE.width / 2, SLIDE.height * 0.5, dishScale(kind, SLIDE) * 1.45)
  write(`assets/images/hero/${name}.svg`, cutout(SLIDE.width, SLIDE.height, name, inner))
}

// Promo cards — cut-outs again, a little smaller in frame than a hero slide
// so the card's own headline keeps the lead.
for (const [name, [kind, options]] of Object.entries(PROMO_CARDS)) {
  const art = renderDish(name, [kind, options])
  const inner = place(art, SLIDE.width / 2, SLIDE.height * 0.5, dishScale(kind, SLIDE) * 1.5)
  write(`assets/images/promo/${name}.svg`, cutout(SLIDE.width, SLIDE.height, name, inner))
}

// Rooms.
for (const [name, [variant, canvas]] of Object.entries(ROOMS)) {
  const random = seeded(name)
  const inner = room(random, canvas.width, canvas.height, variant)
  write(
    `assets/images/restaurant/${name}.svg`,
    frame(canvas.width, canvas.height, name, inner, { hue: 24, glow: 0.16 }),
  )
}

// Hero — the signature burger, large, with room around it for the headline.
{
  const random = seeded('hero-main')
  const art = place(burger(random, { double: true }), HERO.width * 0.5, HERO.height * 0.52, 1.55)
  write(
    'assets/images/hero/hero-main.svg',
    frame(HERO.width, HERO.height, 'hero-main', art, { hue: 20, glow: 0.42 }),
  )
}

/* -- Write ----------------------------------------------------------------- */
let written = 0
for (const [relativePath, contents] of files) {
  const fullPath = join(PUBLIC_DIR, relativePath)
  mkdirSync(dirname(fullPath), { recursive: true })
  writeFileSync(fullPath, contents, 'utf8')
  written += 1
}

console.log(`Generated ${written} artwork files into public/assets/images/`)
