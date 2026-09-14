# EMBER — restaurant ordering website

A complete front-end for a restaurant ordering site: browse a menu, customise
items, choose delivery / pickup / dine-in, check out in five steps, and track
the order afterwards.

Built with **React + Vite + React Router**, plain modern **CSS Modules**, and
local mock data. No backend, no database, no build tooling beyond Vite.

> **This is a front-end prototype for client review.** No payment is processed,
> no order reaches a kitchen, "authentication" stores accounts in your browser,
> and loyalty points are worked out in the browser too. Every place that
> pretends is marked with a `DEMO NOTE` comment in the code, and the UI says so
> to the customer as well. The backend, database and real authentication land
> in a later phase — see [Connecting a backend](#connecting-a-backend).

---

## Getting started

> **Run these from inside the `ember` folder**, not from `source` or `repos`.
> npm needs to find `package.json`, and it only exists here.

Copy-paste this whole block into PowerShell:

```powershell
cd c:\Users\Biko\source\repos\ember
npm install
npm run dev
```

`npm run dev` opens your browser at http://localhost:5173 by itself. If it does
not, open that address manually - and leave the terminal running, because
closing it stops the server.

**If you see `npm error code ENOENT` or `Missing script: "dev"`**, you are in the
wrong folder. `cd` to the path above and try again. Confirm with `dir` - you
should see `package.json`, `src` and `index.html` listed.

```bash
npm run build     # production build into dist/
npm run preview   # serve that build locally
```

Requires Node 18 or newer.

---

## Project structure

```text
ember/
├── index.html                  Page shell, <title>, meta description, fonts
├── vite.config.js              Vite + the "@" -> /src import alias
├── ASSETS.md                   Which images to add, and at what size
│
├── scripts/                    Build-time only, nothing imports these
│   ├── generate-artwork.mjs    Writes all 82 images into public/
│   ├── artwork-kit.mjs         Shared drawing primitives
│   ├── artwork-dishes.mjs      The dish renderers
│   ├── artwork-scenes.mjs      Rooms and offer banners
│   └── generate-app-icon.mjs   The 512x512 home-screen icon
│
├── public/
│   ├── favicon.svg
│   └── assets/
│       ├── logo/
│       └── images/
│           ├── hero/           Homepage hero photography
│           ├── products/       One photo per menu item
│           ├── categories/     Category thumbnails
│           ├── offers/         Promotional banners
│           └── restaurant/     Interiors, kitchen, team, branches
│
└── src/
    ├── main.jsx                Entry point — mounts the providers
    ├── App.jsx                 Every route in one file
    │
    ├── config/
    │   └── restaurant.js       Brand name, fees, contact, promo codes,
    │                           and the whole Ember Rewards economy
    │
    ├── data/                   All content. Edit these, not the components.
    │   ├── menu.js             Every product
    │   ├── categories.js       Menu categories
    │   ├── offers.js           Deals and banners
    │   ├── heroSlides.js       The homepage banner, slide by slide
    │   ├── promoCards.js       The homepage promo grid, card by card
    │   ├── branches.js         Locations, hours, delivery areas
    │   ├── orderTypes.js       Delivery / pickup / dine-in
    │   ├── paymentMethods.js   Mock payment options
    │   └── navigation.js       Navbar and footer links
    │
    ├── services/               THE SEAM THE BACKEND REPLACES
    │   ├── mockApi.js          Fake latency, ApiError, password digesting
    │   ├── authService.js      Sign up, log in, profile, password
    │   ├── ordersService.js    Place an order, read the history
    │   └── loyaltyService.js   Read the ledger, earn and redeem points
    │
    ├── context/                Shared state
    │   ├── CartContext.jsx     Basket, order type, branch, promo code
    │   ├── AuthContext.jsx     Who is signed in
    │   ├── LoyaltyContext.jsx  Points balance, tier, history, redeeming
    │   ├── FavoritesContext.jsx  Hearted items
    │   └── ToastContext.jsx    The little confirmation messages
    │
    ├── hooks/
    │   ├── useLocalStorage.js  useState that survives a refresh
    │   ├── useOrders.js        Order history
    │   ├── useAddToCart.js     Add + confirm, used by every "Add" button
    │   ├── useReorder.js       Refill the basket from a past order
    │   ├── useProductSelections.js  Option-picking state
    │   ├── useDocumentTitle.js Per-page <title> and meta description
    │   ├── useDebouncedValue.js
    │   └── useBodyScrollLock.js
    │
    ├── utils/                  Pure functions — no React in here
    │   ├── cart.js             Line items, pricing, totals
    │   ├── money.js            Price formatting
    │   ├── search.js           Menu search and sorting
    │   ├── orders.js           Order numbers, status timeline
    │   ├── validation.js       Form rules
    │   └── storage.js          The one place localStorage is touched
    │
    ├── components/             One folder per component: .jsx + .module.css
    │   ├── Button/  Modal/  Icon/  Tag/  FormField/  ChoiceList/
    │   ├── QuantitySelector/  EmptyState/  Toast/  AppImage/
    │   ├── Navbar/  MobileMenu (inside Navbar/)  Footer/  Logo/
    │   ├── LocationBar/  LanguageSwitcher/
    │   ├── HeroSlider/  PromoCards/  Hero/  SectionHeader/  PageHeader/
    │   ├── AuthLayout/
    │   ├── OrderTypeSelector/  CategoryNavigation/  CategoryTiles/
    │   ├── ProductCard/  ProductGrid/  ProductModal/  ProductOptions/
    │   ├── FavoriteButton/  SearchBar/  OfferCard/  BranchCard/
    │   ├── CartDrawer/  CartItem/  CartSummary/  PromoCodeInput/
    │   ├── CheckoutStepper/  OrderStatusTimeline/
    │   └── ScrollToTop/  ProtectedRoute/
    │
    ├── pages/                  One folder per route
    │   ├── Home/  Menu/  ProductDetails/  Offers/  Rewards/  About/  Branches/
    │   ├── Cart/  Checkout/ (+ steps/)  OrderConfirmation/
    │   ├── Login/  Signup/  Account/  Orders/  NotFound/
    │
    └── styles/
        └── global.css          Design tokens, reset, base styles
```

### Routes

| Path | Page |
| --- | --- |
| `/` | Homepage |
| `/menu` | Full menu (`?category=burgers&q=cheese`) |
| `/menu/:itemId` | Product details |
| `/offers` | Deals and promo codes |
| `/rewards` | Ember Rewards — how it works, the catalogue, your balance |
| `/about` | Story, values, contact, privacy, terms |
| `/branches` | Locations |
| `/cart` | Basket |
| `/checkout` | Five-step checkout |
| `/orders` | Order history |
| `/orders/:orderNumber` | Order confirmation and tracking |
| `/login`, `/signup` | Demo authentication |
| `/account` | Customer dashboard (requires login) |
| anything else | 404 |

---

## How to change things

### Add a menu item

Open `src/data/menu.js`, copy any object and edit it:

```js
{
  id: 'smoked-brisket-burger',       // unique, lowercase, dashes — also the URL
  name: 'Smoked Brisket Burger',
  category: 'burgers',               // must match an id in data/categories.js
  description: 'Twelve-hour smoked brisket with pickled onion and aioli.',
  price: 215,                        // EGP, a plain number
  image: '/assets/images/products/burger-brisket.svg',
  featured: true,                    // optional — homepage + "Featured" tab
  popular: true,                     // optional — shows a "Popular" tag
}
```

Then drop `burger-brisket.svg` (or a `.jpg` photo, adjusting the extension
above) into `public/assets/images/products/`. That is the whole job — the menu page, search, homepage and category filters all pick
it up automatically.

Optional extras: `oldPrice` (shows a struck-through price and a discount
badge), `spicy`, `vegetarian`, `calories`, and `customizations`.

### Give an item options

Add a `customizations` array. Groups are either `single` (radio buttons) or
`multiple` (checkboxes):

```js
customizations: [
  {
    id: 'size',
    label: 'Choose your size',
    type: 'single',
    required: true,                  // the first option is pre-selected
    options: [
      { id: 'regular', label: 'Regular', price: 0 },
      { id: 'large', label: 'Large', price: 35 },   // added to the item price
    ],
  },
]
```

The top of `menu.js` has helpers (`sizeGroup`, `burgerExtras`, `dipGroup`, …)
for the groups that repeat across many items — reuse those rather than
copy-pasting.

### Change a price

Edit the `price` number on that item in `src/data/menu.js`. Option surcharges
are the `price` on each option. Nothing else needs touching — every total on
the site is calculated from these.

### Add a category

1. Add an entry to `src/data/categories.js`:
   ```js
   { id: 'salads', name: 'Salads', description: 'Fresh, crisp, not an afterthought.',
     image: '/assets/images/categories/category-salads.svg' }
   ```
2. Set `category: 'salads'` on the items that belong to it.
3. Add the thumbnail image.

It appears in the category bar, the homepage tiles and the menu filter.

### Change the restaurant name

`src/config/restaurant.js`:

```js
export const restaurant = {
  name: 'EMBER',
  tagline: 'Made Fresh. Served Hot.',
  ...
}
```

The name is never hard-coded anywhere else — the logo, page titles, footer and
About page all read it from here.

### Change the colours

The site ships with a warm dark theme. Everything comes from the `:root` block
at the top of `src/styles/global.css`:

```css
:root {
  color-scheme: dark;             /* dark scrollbars, selects, date pickers */

  --color-primary: #ff5c1f;       /* buttons, links, active states          */
  --color-primary-dark: #ff7c48;  /* hover — lighter, because the page is dark */
  --color-primary-soft: ...;      /* translucent tint for selected rows      */
  --color-on-primary: #1a1008;    /* text sitting ON a solid orange fill     */
  --color-secondary: #ffc24d;     /* amber accents                           */

  --color-background: #100e0d;    /* the page                                */
  --color-surface: #191614;       /* cards and panels                        */
  --color-surface-alt: #221e1b;   /* inputs, hovers, one step up             */
  --color-ink: #ffffff;           /* headings                                */
  --color-text: #e8e3dd;          /* body copy                               */
  --color-muted: #a49c94;         /* secondary copy                          */
  --color-border: #2e2825;        /* hairlines                               */
}
```

No component hard-codes a hex value, so changing these changes the whole site.

Two rules worth keeping if you re-colour it:

- **`--color-on-primary` is the text on orange**, not white. White on a bright
  accent fails contrast; this near-black passes at 6:1. If you pick a darker
  accent, set this to white instead.
- **Hover goes lighter, not darker.** On a dark page, darkening a button makes
  it recede instead of respond.

Every text/background pair in the palette was checked against WCAG AA (4.5:1);
the lowest is orange-on-a-tinted-chip at 4.89:1.

**Want a light theme back?** Swap the neutrals (`--color-background` and
`--color-surface` light, `--color-ink` and `--color-text` dark), darken
`--color-primary` to around `#d94f1e`, set `--color-on-primary` to `#ffffff`,
and change `color-scheme` to `light`. Nothing outside that block needs editing.

### Change fees, delivery times or promo codes

`src/config/restaurant.js` → `orderSettings` and `promoCodes`. Delivery fee,
the free-delivery threshold, the minimum delivery order, and the times quoted
to customers all live there.

### Change branches

`src/data/branches.js`. The `services` array controls which order types a
branch supports, so a delivery-only branch simply will not appear in the
dine-in picker at checkout.

---

## Connecting a backend

**Everything pretend lives in `src/services/`.** Each function there already
returns the shape the UI expects and throws `ApiError` on failure, so replacing
a body with a `fetch` changes nothing above it — no context, page or component
has to move.

| Replace | What it does now | What to do instead |
| --- | --- | --- |
| `services/authService.js` | Reads and writes accounts in localStorage; digests passwords with SHA-256 | Call your auth API. Hash properly on the server (bcrypt/argon2) and issue a session. |
| `services/ordersService.js` | Writes the order to localStorage | `POST /orders`, return the created order. Load history with a `GET`. |
| `services/loyaltyService.js` | Keeps a points ledger per account in localStorage | `GET /loyalty`, `POST /loyalty/earn`, `POST /loyalty/redeem`. **The server must own the arithmetic.** |
| `services/mockApi.js` | Fakes latency and errors | Delete it, or keep `ApiError` and `toDisplayError` — the UI depends on those two. |
| `utils/orders.js` → `getOrderProgress` | Works out the status from the time since the order was placed | Use the status your kitchen system reports. |
| `data/menu.js` | Exports a static array | Fetch the menu and expose it through the same helper functions (`getItemById`, …). |

### What must move server-side, not just get wired up

The prototype computes these in the browser because there is nowhere else to
put them yet. They are **not** safe as they stand:

- **Loyalty points.** `LoyaltyContext` derives the balance by summing the
  ledger, and `loyaltyService.redeemReward` re-checks affordability against
  that sum — the right rule, in the wrong place. A customer can edit their own
  ledger in devtools. The server has to own earning, the balance and redemption.
- **Order totals.** `utils/cart.js` prices the basket in the browser. The
  server must recompute every total from its own menu and ignore what the
  client sends.
- **Promo codes.** `config/restaurant.js` lists them client-side, so anyone can
  read them. Validate on the server.
- **Payment.** `data/paymentMethods.js` and `steps/PaymentStep.jsx` say plainly
  that nothing is charged. Wire in a provider and remove the notice.
- **Passwords.** `mockApi.js` digests them with a bare SHA-256 so the demo does
  not keep what someone typed. That is not password storage — the server needs
  a salted, slow hash.

`src/utils/storage.js` is the single place localStorage is touched, so it is
easy to see everything currently persisted on the device.

### Changing the loyalty rules

`src/config/restaurant.js` → `loyaltySettings` holds the entire economy: the
earn rate, the joining bonus, what a point is worth, whether delivery fees
earn, and the four tiers with their multipliers. Change `pointsPerEgp` there
and the rewards page, the account page, the checkout preview and the order
confirmation all follow — the number is not written down anywhere else. The
reward catalogue itself is `src/data/loyalty.js`.

---

## Notes on the build

- **Dark by design.** Warm near-blacks rather than grey, so the neutrals never
  look cold beside food photography. Depth comes from three surface levels
  (page / card / input) plus shadow, not from borders alone.
- **CSS Modules, not a framework.** Each component owns a `.module.css` next to
  it, so class names never collide and deleting a component deletes its styles.
  All design decisions come from the tokens in `global.css`.
- **Photography leads.** The hero runs full-bleed behind a transparent navbar,
  category tiles are photo-filled, and product cards fade the image into the
  card body. The site is built to show off good food pictures.
- **Artwork, until there is photography.** Every image slot ships with a
  generated illustration drawn in the brand palette by
  `scripts/generate-artwork.mjs`, so the prototype never shows an empty box.
  Each one is a drop-in replacement for a real photo at the same path — see
  [ASSETS.md](./ASSETS.md). `<AppImage>` holds the aspect ratio, fades each
  image in once decoded, and still draws a warm panel if a file is missing.
- **Responsive by layout, not by shrinking.** Navigation lives behind the menu
  button at every width, the product grid steps 1 → 2 → 3 → 4 columns, checkout
  stacks, and the basket becomes a full-height drawer.
- **Accessibility.** Semantic landmarks, a skip link, labelled form controls
  with `aria-invalid` and linked error messages, visible focus rings, keyboard
  and Escape handling on the modal and drawers, and `prefers-reduced-motion`
  support.
- **State lives where it is used.** Five small contexts (cart, auth, loyalty,
  favourites, toasts) and a handful of hooks — no state-management library.
- **Nothing is faked in a component.** Every pretend call goes through
  `src/services/`, which is why the loading, error and success states on screen
  are real ones rather than decoration.
- **The points balance is never stored.** It is summed from the ledger on every
  render, so the number and the history that explains it cannot drift apart.

See [ASSETS.md](./ASSETS.md) for the full list of images to add.
# ember
