# EMBER — restaurant ordering website

A complete front-end for a restaurant ordering site: browse a menu, customise
items, choose delivery / pickup / dine-in, check out in five steps, and track
the order afterwards.

Built with **React + Vite + React Router**, plain modern **CSS Modules**, and
local mock data. No backend, no database, no build tooling beyond Vite.

> **This is a front-end demo.** No payment is processed, no order reaches a
> kitchen, and "authentication" stores accounts in your browser. Every place
> that pretends is marked with a `DEMO NOTE` comment in the code, and the UI
> says so to the customer too. See [Connecting a backend](#connecting-a-backend).

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
    │   └── restaurant.js       Brand name, fees, contact, promo codes
    │
    ├── data/                   All content. Edit these, not the components.
    │   ├── menu.js             Every product
    │   ├── categories.js       Menu categories
    │   ├── offers.js           Deals and banners
    │   ├── branches.js         Locations, hours, delivery areas
    │   ├── orderTypes.js       Delivery / pickup / dine-in
    │   ├── paymentMethods.js   Mock payment options
    │   └── navigation.js       Navbar and footer links
    │
    ├── context/                Shared state
    │   ├── CartContext.jsx     Basket, order type, branch, promo code
    │   ├── AuthContext.jsx     Demo accounts and saved addresses
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
    │   ├── Hero/  SectionHeader/  PageHeader/  AuthLayout/
    │   ├── OrderTypeSelector/  CategoryNavigation/  CategoryTiles/
    │   ├── ProductCard/  ProductGrid/  ProductModal/  ProductOptions/
    │   ├── FavoriteButton/  SearchBar/  OfferCard/  BranchCard/
    │   ├── CartDrawer/  CartItem/  CartSummary/  PromoCodeInput/
    │   ├── CheckoutStepper/  OrderStatusTimeline/
    │   └── ScrollToTop/  ProtectedRoute/
    │
    ├── pages/                  One folder per route
    │   ├── Home/  Menu/  ProductDetails/  Offers/  About/  Branches/
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
  image: '/assets/images/products/burger-brisket.jpg',
  featured: true,                    // optional — homepage + "Featured" tab
  popular: true,                     // optional — shows a "Popular" tag
}
```

Then drop `burger-brisket.jpg` into `public/assets/images/products/`. That is
the whole job — the menu page, search, homepage and category filters all pick
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
     image: '/assets/images/categories/category-salads.jpg' }
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

The demo behaviour is deliberately confined to four files. Replace their
insides and every component keeps working, because they all go through the
returned functions rather than touching storage directly.

| Replace | What it does now | What to do instead |
| --- | --- | --- |
| `src/context/AuthContext.jsx` | `signup` / `login` / `logout` read and write a list of accounts in localStorage | Call your auth API. Keep returning `{ user }` or `{ error }` and nothing else changes. |
| `src/hooks/useOrders.js` | `placeOrder` writes to localStorage and returns the order | `POST /orders`, return the created order. Load history with a `GET`. |
| `src/utils/orders.js` → `getOrderProgress` | Works out the status from the time since the order was placed | Use the status your kitchen system reports. |
| `src/data/menu.js` | Exports a static array | Fetch the menu and expose it through the same helper functions (`getItemById`, `getItemsByCategory`, …). |

Two more places to revisit:

- **Payment** — `src/data/paymentMethods.js` and `pages/Checkout/steps/PaymentStep.jsx`
  currently state plainly that nothing is charged. Wire in a real provider and
  remove the notice.
- **Promo codes** — `config/restaurant.js` lists them client-side, which means
  anyone can read them. Validate codes on the server.

`src/utils/storage.js` is the single place localStorage is touched, so it is
easy to see everything that is currently persisted on the device.

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
- **Images degrade gracefully.** Every photo goes through `<AppImage>`, which
  draws a warm lit panel when a file is missing — so the layout looks
  intentional before you have added your own photography.
- **Responsive by layout, not by shrinking.** The navbar collapses to a
  slide-in menu, the product grid steps 1 → 2 → 3 → 4 columns, checkout stacks,
  and the basket becomes a full-height drawer.
- **Accessibility.** Semantic landmarks, a skip link, labelled form controls
  with `aria-invalid` and linked error messages, visible focus rings, keyboard
  and Escape handling on the modal and drawers, and `prefers-reduced-motion`
  support.
- **State lives where it is used.** Four small contexts (cart, auth,
  favourites, toasts) and a handful of hooks — no state-management library.

See [ASSETS.md](./ASSETS.md) for the full list of images to add.
