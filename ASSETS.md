# Assets to replace

Every image lives in `public/assets/`.

**The site currently ships with generated artwork, not photography.** Every slot
listed below already has an illustrated `.svg` drawn in the EMBER palette, so
the prototype looks art-directed while the real photographs are being shot.
Those files are produced by `node scripts/generate-artwork.mjs` — you never edit
them by hand, and once real photos land you can delete the script.

## Replacing one with a real photograph

1. Drop your photo into the same folder, keeping the base name — e.g.
   `public/assets/images/products/burger-classic.jpg`.
2. Change the extension in the one place the name appears, the matching `image`
   value in `src/data/*.js`:
   `image: '/assets/images/products/burger-classic.svg'` →
   `...burger-classic.jpg`.

That is the whole job. Nothing else references the filename. Do them a few at a
time — the ones you have not replaced keep their artwork.

`.jpg` and `.webp` both work. If a file is ever missing entirely, the site draws
a warm placeholder panel rather than a broken image.

**Keep every photo in a category the same crop and distance.** A grid of dishes
shot from the same angle is most of what makes a food site look professional.

---

## Hero — `public/assets/images/hero/`

| File | Size | Where it appears | What it should show |
| --- | --- | --- | --- |
| `hero-main.svg` | 1600 × 1200 (4:3) | Homepage hero, right-hand side | Your single best-looking dish, shot close and warm. A card overlaps the bottom-left corner, so keep that area quiet. |

## Products — `public/assets/images/products/`

**1200 × 750 (16:10 landscape)** — one per item in `src/data/menu.js`.
The dish centred on a plain, uncluttered background. Tags sit over the
bottom-left corner and a heart over the top-right, so leave those corners calm.

**Burgers** — `burger-double-stack.svg`, `burger-classic.svg`,
`burger-smoky-bbq.svg`, `burger-fiery-crunch.svg`, `burger-mushroom-swiss.svg`,
`burger-halloumi.svg`, `burger-signature.svg`

**Chicken** — `chicken-crispy-strips.svg`, `chicken-hot-wings.svg`,
`chicken-popcorn.svg`, `chicken-grilled-quarter.svg`,
`chicken-crispy-fillets.svg`, `chicken-bucket-8.svg`

**Meals** — `meal-crispy-strips.svg`, `meal-burger-combo.svg`,
`meal-grilled-chicken.svg`, `meal-wings.svg`, `meal-double-stack.svg`,
`meal-two-piece.svg`, `meal-veggie.svg`

**Pizza** — `pizza-margherita.svg`, `pizza-pepperoni.svg`,
`pizza-bbq-chicken.svg`, `pizza-four-cheese.svg`, `pizza-spicy-beef.svg`

**Sandwiches** — `sandwich-crispy-chicken.svg`, `sandwich-grilled-wrap.svg`,
`sandwich-fiery-chicken.svg`, `sandwich-steak-melt.svg`, `sandwich-club.svg`

**Sides** — `side-fries.svg`, `side-loaded-fries.svg`, `side-onion-rings.svg`,
`side-coleslaw.svg`, `side-mashed-potato.svg`, `side-garlic-bread.svg`

**Desserts** — `dessert-chocolate-cake.svg`, `dessert-cheesecake.svg`,
`dessert-brownie-sundae.svg`, `dessert-cookie.svg`, `dessert-ice-cream.svg`

**Drinks** — `drink-cola.svg`, `drink-orange.svg`, `drink-lemon-mint.svg`,
`drink-mango-smoothie.svg`, `drink-iced-tea.svg`, `drink-water.svg`,
`drink-coffee.svg`

**Family meals** — `family-feast-bucket.svg`, `family-burger-box.svg`,
`family-mixed-grill.svg`, `family-pizza-night.svg`

## Categories — `public/assets/images/categories/`

**600 × 600 (square)** — the small round-cornered thumbnails on the homepage.
One clear, tightly cropped dish per category.

`category-featured.svg`, `category-meals.svg`, `category-burgers.svg`,
`category-chicken.svg`, `category-pizza.svg`, `category-sandwiches.svg`,
`category-sides.svg`, `category-desserts.svg`, `category-drinks.svg`,
`category-family.svg`

## Offers — `public/assets/images/offers/`

**1200 × 750 (16:10 landscape)** — homepage offer strip and the `/offers` page.
A dark badge sits in the top-left corner, so keep that area free of detail.

`offer-family-feast.svg`, `offer-bogo-burger.svg`, `offer-first-order.svg`,
`offer-free-delivery.svg`, `offer-pizza-night.svg`, `offer-student-lunch.svg`

## Restaurant — `public/assets/images/restaurant/`

| File | Size | Where it appears | What it should show |
| --- | --- | --- | --- |
| `restaurant-kitchen.svg` | 1200 × 750 | Homepage story band | The kitchen or grill in action. |
| `restaurant-interior.svg` | 1200 × 750 | About page, "How it started" | The dining room, ideally with people in it. |
| `restaurant-grill.svg` | 800 × 800 | About page photo strip | A cook working the grill. |
| `restaurant-team.svg` | 800 × 800 | About page photo strip | The team before service. |
| `restaurant-bakery.svg` | 800 × 800 | About page photo strip | Bread, buns, or prep work. |
| `restaurant-counter.svg` | 1200 × 1600 (3:4) | Login page side panel | The order counter, shot vertically. Text is overlaid, so keep it calm. |
| `restaurant-dining.svg` | 1200 × 1600 (3:4) | Sign-up page side panel | Guests eating, shot vertically. Text is overlaid. |

**Branch photos** — 1200 × 750, one per branch on the Locations page. Names come
from `src/data/branches.js`:
`branch-zamalek.svg`, `branch-new-cairo.svg`, `branch-maadi.svg`,
`branch-sheikh-zayed.svg`, `branch-heliopolis.svg`, `branch-alexandria.svg`

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

## Checking your progress

Run `npm run dev` and open `/menu` — it shows every product at once, so it is
the fastest way to see which dishes are still on generated artwork and which
have real photography.

## Regenerating the artwork

```bash
node scripts/generate-artwork.mjs   # all 82 images
node scripts/generate-app-icon.mjs  # the 512x512 home-screen icon
```

Both are build-time scripts with no dependencies. Nothing in the running app
imports them.
