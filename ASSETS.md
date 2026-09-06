# Assets to replace

Every image lives in `public/assets/`. Drop a file in with the name below and it
appears on the site — **no code changes needed**.

Until a file exists, the site draws a tidy striped placeholder instead of a
broken image, so you can add photography a few files at a time.

All files are `.jpg`. Use `.webp` if you prefer — just update the matching
`image` value in the data file, which is the only place the name appears.

**Keep every photo in a category the same crop and distance.** A grid of dishes
shot from the same angle is most of what makes a food site look professional.

---

## Hero — `public/assets/images/hero/`

| File | Size | Where it appears | What it should show |
| --- | --- | --- | --- |
| `hero-main.jpg` | 1600 × 1200 (4:3) | Homepage hero, right-hand side | Your single best-looking dish, shot close and warm. A card overlaps the bottom-left corner, so keep that area quiet. |

## Products — `public/assets/images/products/`

**1200 × 750 (16:10 landscape)** — one per item in `src/data/menu.js`.
The dish centred on a plain, uncluttered background. Tags sit over the
bottom-left corner and a heart over the top-right, so leave those corners calm.

**Burgers** — `burger-double-stack.jpg`, `burger-classic.jpg`,
`burger-smoky-bbq.jpg`, `burger-fiery-crunch.jpg`, `burger-mushroom-swiss.jpg`,
`burger-halloumi.jpg`, `burger-signature.jpg`

**Chicken** — `chicken-crispy-strips.jpg`, `chicken-hot-wings.jpg`,
`chicken-popcorn.jpg`, `chicken-grilled-quarter.jpg`,
`chicken-crispy-fillets.jpg`, `chicken-bucket-8.jpg`

**Meals** — `meal-crispy-strips.jpg`, `meal-burger-combo.jpg`,
`meal-grilled-chicken.jpg`, `meal-wings.jpg`, `meal-double-stack.jpg`,
`meal-two-piece.jpg`, `meal-veggie.jpg`

**Pizza** — `pizza-margherita.jpg`, `pizza-pepperoni.jpg`,
`pizza-bbq-chicken.jpg`, `pizza-four-cheese.jpg`, `pizza-spicy-beef.jpg`

**Sandwiches** — `sandwich-crispy-chicken.jpg`, `sandwich-grilled-wrap.jpg`,
`sandwich-fiery-chicken.jpg`, `sandwich-steak-melt.jpg`, `sandwich-club.jpg`

**Sides** — `side-fries.jpg`, `side-loaded-fries.jpg`, `side-onion-rings.jpg`,
`side-coleslaw.jpg`, `side-mashed-potato.jpg`, `side-garlic-bread.jpg`

**Desserts** — `dessert-chocolate-cake.jpg`, `dessert-cheesecake.jpg`,
`dessert-brownie-sundae.jpg`, `dessert-cookie.jpg`, `dessert-ice-cream.jpg`

**Drinks** — `drink-cola.jpg`, `drink-orange.jpg`, `drink-lemon-mint.jpg`,
`drink-mango-smoothie.jpg`, `drink-iced-tea.jpg`, `drink-water.jpg`,
`drink-coffee.jpg`

**Family meals** — `family-feast-bucket.jpg`, `family-burger-box.jpg`,
`family-mixed-grill.jpg`, `family-pizza-night.jpg`

## Categories — `public/assets/images/categories/`

**600 × 600 (square)** — the small round-cornered thumbnails on the homepage.
One clear, tightly cropped dish per category.

`category-featured.jpg`, `category-meals.jpg`, `category-burgers.jpg`,
`category-chicken.jpg`, `category-pizza.jpg`, `category-sandwiches.jpg`,
`category-sides.jpg`, `category-desserts.jpg`, `category-drinks.jpg`,
`category-family.jpg`

## Offers — `public/assets/images/offers/`

**1200 × 750 (16:10 landscape)** — homepage offer strip and the `/offers` page.
A dark badge sits in the top-left corner, so keep that area free of detail.

`offer-family-feast.jpg`, `offer-bogo-burger.jpg`, `offer-first-order.jpg`,
`offer-free-delivery.jpg`, `offer-pizza-night.jpg`, `offer-student-lunch.jpg`

## Restaurant — `public/assets/images/restaurant/`

| File | Size | Where it appears | What it should show |
| --- | --- | --- | --- |
| `restaurant-kitchen.jpg` | 1200 × 750 | Homepage story band | The kitchen or grill in action. |
| `restaurant-interior.jpg` | 1200 × 750 | About page, "How it started" | The dining room, ideally with people in it. |
| `restaurant-grill.jpg` | 800 × 800 | About page photo strip | A cook working the grill. |
| `restaurant-team.jpg` | 800 × 800 | About page photo strip | The team before service. |
| `restaurant-bakery.jpg` | 800 × 800 | About page photo strip | Bread, buns, or prep work. |
| `restaurant-counter.jpg` | 1200 × 1600 (3:4) | Login page side panel | The order counter, shot vertically. Text is overlaid, so keep it calm. |
| `restaurant-dining.jpg` | 1200 × 1600 (3:4) | Sign-up page side panel | Guests eating, shot vertically. Text is overlaid. |

**Branch photos** — 1200 × 750, one per branch on the Locations page. Names come
from `src/data/branches.js`:
`branch-zamalek.jpg`, `branch-new-cairo.jpg`, `branch-maadi.jpg`,
`branch-sheikh-zayed.jpg`, `branch-heliopolis.jpg`, `branch-alexandria.jpg`

## Logo — `public/assets/logo/`

The logo is drawn as inline SVG in `src/components/Logo/Logo.jsx`, so it already
works with no files here. To use your own artwork, drop it in this folder and
follow the comment at the top of that file.

| File | Size | Where it appears |
| --- | --- | --- |
| `logo-mark.png` | 512 × 512 | Apple touch icon (linked from `index.html`) |

The browser tab icon is `public/favicon.svg` — a small hand-drawn ember. Replace
that file to change it.

---

## Checking what is still missing

Run `npm run dev` and browse the site. Anything still showing a striped
placeholder has no file yet. The menu page is the fastest way to spot gaps —
it shows every product at once.
