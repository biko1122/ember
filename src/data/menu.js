/**
 * The full EMBER menu.
 *
 * ---------------------------------------------------------------------------
 * ADDING A PRODUCT
 * ---------------------------------------------------------------------------
 * Copy any object below and edit it. Only `id`, `name`, `category`,
 * `description`, `price` and `image` are required.
 *
 *   id             unique, lowercase, dash-separated — also used in the URL
 *   category       must match an `id` from data/categories.js
 *   price          number, in EGP (no currency symbol, no quotes)
 *   oldPrice       optional — shows a struck-through price + a discount badge
 *   image          path inside /public, so you can drop your own file in
 *   featured       optional — shows on the homepage and the "Featured" tab
 *   popular        optional — shows a "Popular" tag on the card
 *   spicy          optional — shows a chilli tag
 *   vegetarian     optional — shows a leaf tag
 *   calories       optional — displayed on the product page
 *   customizations optional — see the option-group helpers just below
 * ---------------------------------------------------------------------------
 */

/* -- Reusable option groups -------------------------------------------------
   Most items share the same choices, so they are built by these small helpers
   rather than being copy-pasted onto every single product.                    */

const sizeGroup = (largeSurcharge) => ({
  id: 'size',
  label: 'Choose your size',
  type: 'single',
  required: true,
  options: [
    { id: 'regular', label: 'Regular', price: 0 },
    { id: 'large', label: 'Large', price: largeSurcharge },
  ],
})

const spiceGroup = () => ({
  id: 'spice',
  label: 'Heat level',
  type: 'single',
  required: true,
  options: [
    { id: 'mild', label: 'Mild', price: 0 },
    { id: 'hot', label: 'Hot', price: 0 },
    { id: 'fiery', label: 'Fiery', price: 0 },
  ],
})

const burgerExtras = () => ({
  id: 'extras',
  label: 'Add extras',
  type: 'multiple',
  options: [
    { id: 'extra-cheese', label: 'Extra cheese', price: 20 },
    { id: 'extra-patty', label: 'Extra patty', price: 55 },
    { id: 'bacon', label: 'Smoked beef bacon', price: 35 },
    { id: 'jalapenos', label: 'Jalapenos', price: 12 },
    { id: 'extra-sauce', label: 'Extra ember sauce', price: 10 },
  ],
})

const mealSideGroup = () => ({
  id: 'meal-side',
  label: 'Pick your side',
  type: 'single',
  required: true,
  options: [
    { id: 'fries', label: 'Ember fries', price: 0 },
    { id: 'coleslaw', label: 'Creamy coleslaw', price: 0 },
    { id: 'mash', label: 'Mashed potato and gravy', price: 10 },
    { id: 'onion-rings', label: 'Onion rings', price: 15 },
    { id: 'loaded-fries', label: 'Loaded cheese fries', price: 30 },
  ],
})

const mealDrinkGroup = () => ({
  id: 'meal-drink',
  label: 'Pick your drink',
  type: 'single',
  required: true,
  options: [
    { id: 'cola', label: 'Cola', price: 0 },
    { id: 'orange', label: 'Orange fizz', price: 0 },
    { id: 'lemon-mint', label: 'Lemon and mint cooler', price: 12 },
    { id: 'iced-tea', label: 'Peach iced tea', price: 12 },
    { id: 'water', label: 'Still water', price: 0 },
  ],
})

const pizzaSizeGroup = () => ({
  id: 'size',
  label: 'Choose your size',
  type: 'single',
  required: true,
  options: [
    { id: 'medium', label: 'Medium — 26cm', price: 0 },
    { id: 'large', label: 'Large — 32cm', price: 70 },
    { id: 'sharing', label: 'Sharing — 40cm', price: 140 },
  ],
})

const pizzaToppings = () => ({
  id: 'toppings',
  label: 'Extra toppings',
  type: 'multiple',
  options: [
    { id: 'extra-mozzarella', label: 'Extra mozzarella', price: 25 },
    { id: 'mushrooms', label: 'Mushrooms', price: 18 },
    { id: 'olives', label: 'Black olives', price: 15 },
    { id: 'peppers', label: 'Roasted peppers', price: 15 },
    { id: 'chilli-oil', label: 'Chilli oil drizzle', price: 10 },
  ],
})

const dipGroup = () => ({
  id: 'dips',
  label: 'Add a dip',
  type: 'multiple',
  options: [
    { id: 'ember-sauce', label: 'Ember sauce', price: 12 },
    { id: 'garlic', label: 'Garlic mayo', price: 12 },
    { id: 'bbq', label: 'Smoky BBQ', price: 12 },
    { id: 'blue-cheese', label: 'Blue cheese', price: 15 },
  ],
})

/* -- The menu -------------------------------------------------------------- */

export const menuItems = [
  /* ---------------------------------------------------------------- BURGERS */
  {
    id: 'double-crispy-stack',
    name: 'Double Crispy Stack',
    category: 'burgers',
    description:
      'Two buttermilk-fried chicken fillets, melted cheddar, crisp lettuce and our ember sauce in a toasted brioche bun.',
    price: 189,
    oldPrice: 219,
    image: '/assets/images/products/burger-double-stack.jpg',
    calories: 820,
    featured: true,
    popular: true,
    customizations: [sizeGroup(35), burgerExtras()],
  },
  {
    id: 'classic-flame-burger',
    name: 'Classic Flame Burger',
    category: 'burgers',
    description:
      'A 150g flame-grilled beef patty with tomato, pickles, onion and house burger sauce. The one we started with.',
    price: 145,
    image: '/assets/images/products/burger-classic.jpg',
    calories: 640,
    popular: true,
    customizations: [burgerExtras()],
  },
  {
    id: 'smoky-bbq-burger',
    name: 'Smoky BBQ Burger',
    category: 'burgers',
    description:
      'Char-grilled beef, smoked beef bacon, crispy onions and a slow-cooked BBQ glaze on a sesame bun.',
    price: 199,
    image: '/assets/images/products/burger-smoky-bbq.jpg',
    calories: 780,
    featured: true,
    customizations: [burgerExtras()],
  },
  {
    id: 'fiery-crunch-burger',
    name: 'Fiery Crunch Burger',
    category: 'burgers',
    description:
      'Chicken fillet tossed in chilli crumb with pepper jack, jalapenos and a cooling herb mayo.',
    price: 175,
    image: '/assets/images/products/burger-fiery-crunch.jpg',
    calories: 710,
    spicy: true,
    customizations: [spiceGroup(), burgerExtras()],
  },
  {
    id: 'mushroom-swiss-burger',
    name: 'Mushroom and Swiss Burger',
    category: 'burgers',
    description:
      'Beef patty with buttered field mushrooms, nutty Swiss cheese and a truffle-touched mayo.',
    price: 205,
    image: '/assets/images/products/burger-mushroom-swiss.jpg',
    calories: 750,
    customizations: [burgerExtras()],
  },
  {
    id: 'garden-halloumi-burger',
    name: 'Garden Halloumi Burger',
    category: 'burgers',
    description:
      'Grilled halloumi, roasted peppers, rocket and sun-dried tomato pesto. Fully vegetarian.',
    price: 165,
    image: '/assets/images/products/burger-halloumi.jpg',
    calories: 590,
    vegetarian: true,
    customizations: [burgerExtras()],
  },
  {
    id: 'ember-signature-burger',
    name: 'Ember Signature Burger',
    category: 'burgers',
    description:
      'Double 120g patties, aged cheddar, caramelised onion jam and smoked garlic aioli. The kitchen’s own pick.',
    price: 245,
    image: '/assets/images/products/burger-signature.jpg',
    calories: 910,
    featured: true,
    customizations: [burgerExtras()],
  },

  /* ---------------------------------------------------------------- CHICKEN */
  {
    id: 'crispy-strips-5',
    name: 'Crispy Strips — 5 Pieces',
    category: 'chicken',
    description:
      'Five hand-breaded chicken tenders, marinated overnight and fried till golden. Served with a dip of your choice.',
    price: 155,
    image: '/assets/images/products/chicken-crispy-strips.jpg',
    calories: 620,
    popular: true,
    customizations: [dipGroup()],
  },
  {
    id: 'hot-wings-8',
    name: 'Hot Wings — 8 Pieces',
    category: 'chicken',
    description:
      'Eight wings glazed in our chilli-honey butter and finished with toasted sesame.',
    price: 175,
    oldPrice: 195,
    image: '/assets/images/products/chicken-hot-wings.jpg',
    calories: 690,
    spicy: true,
    featured: true,
    customizations: [spiceGroup(), dipGroup()],
  },
  {
    id: 'popcorn-chicken',
    name: 'Popcorn Chicken',
    category: 'chicken',
    description:
      'Bite-sized pieces of seasoned chicken, endlessly snackable, with a dip on the side.',
    price: 110,
    image: '/assets/images/products/chicken-popcorn.jpg',
    calories: 480,
    customizations: [sizeGroup(45), dipGroup()],
  },
  {
    id: 'grilled-quarter-chicken',
    name: 'Grilled Quarter Chicken',
    category: 'chicken',
    description:
      'Quarter chicken marinated in lemon, thyme and smoked paprika, grilled over an open flame.',
    price: 165,
    image: '/assets/images/products/chicken-grilled-quarter.jpg',
    calories: 430,
    customizations: [dipGroup()],
  },
  {
    id: 'crispy-fillets-4',
    name: 'Crispy Fillets — 4 Pieces',
    category: 'chicken',
    description:
      'Four whole breast fillets in our signature crumb — the centrepiece of any table.',
    price: 235,
    image: '/assets/images/products/chicken-crispy-fillets.jpg',
    calories: 880,
    featured: true,
    customizations: [spiceGroup(), dipGroup()],
  },
  {
    id: 'chicken-bucket-8',
    name: 'Ember Bucket — 8 Pieces',
    category: 'chicken',
    description:
      'Eight pieces of bone-in fried chicken seasoned with our eleven-spice rub. Feeds three to four.',
    price: 395,
    image: '/assets/images/products/chicken-bucket-8.jpg',
    calories: 1840,
    popular: true,
    customizations: [spiceGroup(), dipGroup()],
  },

  /* ------------------------------------------------------------------ MEALS */
  {
    id: 'crispy-strips-meal',
    name: 'Crispy Strips Meal',
    category: 'meals',
    description:
      'Four crispy tenders with your choice of side, a drink and a dip. Lunch, handled.',
    price: 215,
    image: '/assets/images/products/meal-crispy-strips.jpg',
    calories: 980,
    featured: true,
    popular: true,
    customizations: [mealSideGroup(), mealDrinkGroup(), dipGroup()],
  },
  {
    id: 'flame-burger-meal',
    name: 'Flame Burger Meal',
    category: 'meals',
    description:
      'The Classic Flame Burger with a side and a drink of your choosing.',
    price: 225,
    image: '/assets/images/products/meal-burger-combo.jpg',
    calories: 1120,
    customizations: [mealSideGroup(), mealDrinkGroup(), burgerExtras()],
  },
  {
    id: 'grilled-chicken-meal',
    name: 'Grilled Chicken Meal',
    category: 'meals',
    description:
      'Grilled quarter chicken with a side, a drink and warm flatbread.',
    price: 245,
    image: '/assets/images/products/meal-grilled-chicken.jpg',
    calories: 860,
    customizations: [mealSideGroup(), mealDrinkGroup()],
  },
  {
    id: 'hot-wings-meal',
    name: 'Hot Wings Meal',
    category: 'meals',
    description:
      'Six chilli-honey wings, a side, a drink and a cooling blue cheese dip.',
    price: 235,
    image: '/assets/images/products/meal-wings.jpg',
    calories: 1020,
    spicy: true,
    customizations: [spiceGroup(), mealSideGroup(), mealDrinkGroup()],
  },
  {
    id: 'double-stack-meal',
    name: 'Double Crispy Stack Meal',
    category: 'meals',
    description:
      'Our best-selling burger with a side and a drink. The full experience.',
    price: 275,
    oldPrice: 305,
    image: '/assets/images/products/meal-double-stack.jpg',
    calories: 1280,
    featured: true,
    customizations: [mealSideGroup(), mealDrinkGroup(), burgerExtras()],
  },
  {
    id: 'two-piece-chicken-meal',
    name: 'Two-Piece Chicken Meal',
    category: 'meals',
    description:
      'Two pieces of bone-in fried chicken with a side, a bun and a drink.',
    price: 205,
    image: '/assets/images/products/meal-two-piece.jpg',
    calories: 940,
    popular: true,
    customizations: [spiceGroup(), mealSideGroup(), mealDrinkGroup()],
  },
  {
    id: 'halloumi-garden-meal',
    name: 'Garden Halloumi Meal',
    category: 'meals',
    description:
      'The Garden Halloumi Burger with a side and a drink. Vegetarian the whole way through.',
    price: 235,
    image: '/assets/images/products/meal-veggie.jpg',
    calories: 890,
    vegetarian: true,
    customizations: [mealSideGroup(), mealDrinkGroup()],
  },

  /* ------------------------------------------------------------------ PIZZA */
  {
    id: 'margherita-pizza',
    name: 'Margherita',
    category: 'pizza',
    description:
      'San Marzano tomato, fresh mozzarella and basil on a 48-hour fermented base.',
    price: 175,
    image: '/assets/images/products/pizza-margherita.jpg',
    calories: 820,
    vegetarian: true,
    customizations: [pizzaSizeGroup(), pizzaToppings()],
  },
  {
    id: 'double-pepperoni-pizza',
    name: 'Double Pepperoni',
    category: 'pizza',
    description:
      'A generous double layer of beef pepperoni that curls and crisps in the stone oven.',
    price: 215,
    image: '/assets/images/products/pizza-pepperoni.jpg',
    calories: 980,
    popular: true,
    featured: true,
    customizations: [pizzaSizeGroup(), pizzaToppings()],
  },
  {
    id: 'bbq-chicken-pizza',
    name: 'BBQ Chicken',
    category: 'pizza',
    description:
      'Grilled chicken, red onion, sweetcorn and a smoky BBQ base under melted mozzarella.',
    price: 225,
    image: '/assets/images/products/pizza-bbq-chicken.jpg',
    calories: 1010,
    customizations: [pizzaSizeGroup(), pizzaToppings()],
  },
  {
    id: 'four-cheese-pizza',
    name: 'Four Cheese',
    category: 'pizza',
    description:
      'Mozzarella, aged cheddar, blue cheese and parmesan with a drizzle of honey.',
    price: 235,
    image: '/assets/images/products/pizza-four-cheese.jpg',
    calories: 1080,
    vegetarian: true,
    customizations: [pizzaSizeGroup(), pizzaToppings()],
  },
  {
    id: 'spicy-beef-pizza',
    name: 'Spicy Beef and Chilli',
    category: 'pizza',
    description:
      'Seasoned minced beef, green chilli, red onion and a chilli oil finish.',
    price: 245,
    image: '/assets/images/products/pizza-spicy-beef.jpg',
    calories: 1120,
    spicy: true,
    customizations: [pizzaSizeGroup(), pizzaToppings()],
  },

  /* ------------------------------------------------------------- SANDWICHES */
  {
    id: 'crispy-chicken-sandwich',
    name: 'Crispy Chicken Sandwich',
    category: 'sandwiches',
    description:
      'A single crispy fillet with pickles and ember sauce in a soft potato roll.',
    price: 125,
    image: '/assets/images/products/sandwich-crispy-chicken.jpg',
    calories: 540,
    popular: true,
    customizations: [burgerExtras()],
  },
  {
    id: 'grilled-chicken-wrap',
    name: 'Grilled Chicken Wrap',
    category: 'sandwiches',
    description:
      'Grilled chicken strips, lettuce, tomato and garlic yoghurt rolled in a warm tortilla.',
    price: 115,
    image: '/assets/images/products/sandwich-grilled-wrap.jpg',
    calories: 470,
    customizations: [dipGroup()],
  },
  {
    id: 'fiery-chicken-sandwich',
    name: 'Fiery Chicken Sandwich',
    category: 'sandwiches',
    description:
      'Chilli-brined fillet, slaw and jalapeno mayo. Order it as hot as you dare.',
    price: 139,
    image: '/assets/images/products/sandwich-fiery-chicken.jpg',
    calories: 580,
    spicy: true,
    featured: true,
    customizations: [spiceGroup(), burgerExtras()],
  },
  {
    id: 'steak-cheese-melt',
    name: 'Steak and Cheese Melt',
    category: 'sandwiches',
    description:
      'Thin-sliced steak, caramelised onion and molten cheddar pressed into a sourdough roll.',
    price: 189,
    image: '/assets/images/products/sandwich-steak-melt.jpg',
    calories: 720,
    customizations: [burgerExtras()],
  },
  {
    id: 'ember-club-sandwich',
    name: 'Ember Club',
    category: 'sandwiches',
    description:
      'Triple-stacked toast with grilled chicken, beef bacon, egg, lettuce and tomato.',
    price: 155,
    image: '/assets/images/products/sandwich-club.jpg',
    calories: 660,
  },

  /* ------------------------------------------------------------------ SIDES */
  {
    id: 'ember-fries',
    name: 'Ember Fries',
    category: 'sides',
    description:
      'Skin-on fries, double-cooked and dusted with our smoked seasoning salt.',
    price: 55,
    image: '/assets/images/products/side-fries.jpg',
    calories: 340,
    popular: true,
    vegetarian: true,
    customizations: [sizeGroup(25), dipGroup()],
  },
  {
    id: 'loaded-cheese-fries',
    name: 'Loaded Cheese Fries',
    category: 'sides',
    description:
      'Ember fries under a blanket of cheese sauce, spring onion and crispy onions.',
    price: 89,
    image: '/assets/images/products/side-loaded-fries.jpg',
    calories: 620,
    featured: true,
    vegetarian: true,
    customizations: [sizeGroup(30)],
  },
  {
    id: 'onion-rings',
    name: 'Beer-Battered Onion Rings',
    category: 'sides',
    description: 'Thick-cut sweet onion in a light, shatteringly crisp batter.',
    price: 65,
    image: '/assets/images/products/side-onion-rings.jpg',
    calories: 410,
    vegetarian: true,
    customizations: [dipGroup()],
  },
  {
    id: 'creamy-coleslaw',
    name: 'Creamy Coleslaw',
    category: 'sides',
    description: 'Shredded cabbage and carrot in a light, tangy buttermilk dressing.',
    price: 45,
    image: '/assets/images/products/side-coleslaw.jpg',
    calories: 180,
    vegetarian: true,
  },
  {
    id: 'mashed-potato-gravy',
    name: 'Mashed Potato and Gravy',
    category: 'sides',
    description: 'Buttery mash under a ladle of rich roast gravy.',
    price: 55,
    image: '/assets/images/products/side-mashed-potato.jpg',
    calories: 260,
    vegetarian: true,
  },
  {
    id: 'garlic-flatbread',
    name: 'Garlic Flatbread',
    category: 'sides',
    description: 'Stone-baked flatbread brushed with garlic butter and parsley.',
    price: 60,
    image: '/assets/images/products/side-garlic-bread.jpg',
    calories: 380,
    vegetarian: true,
    customizations: [
      {
        id: 'flatbread-style',
        label: 'Make it cheesy?',
        type: 'single',
        required: true,
        options: [
          { id: 'plain', label: 'Classic garlic butter', price: 0 },
          { id: 'cheese', label: 'With melted mozzarella', price: 25 },
        ],
      },
    ],
  },

  /* --------------------------------------------------------------- DESSERTS */
  {
    id: 'molten-chocolate-cake',
    name: 'Molten Chocolate Cake',
    category: 'desserts',
    description:
      'Dark chocolate pudding with a liquid centre, served warm with vanilla ice cream.',
    price: 95,
    image: '/assets/images/products/dessert-chocolate-cake.jpg',
    calories: 520,
    featured: true,
    popular: true,
    vegetarian: true,
  },
  {
    id: 'baked-cheesecake',
    name: 'Baked Vanilla Cheesecake',
    category: 'desserts',
    description: 'New York style cheesecake on a biscuit base with a berry compote.',
    price: 89,
    image: '/assets/images/products/dessert-cheesecake.jpg',
    calories: 470,
    vegetarian: true,
  },
  {
    id: 'brownie-sundae',
    name: 'Brownie Sundae',
    category: 'desserts',
    description:
      'Warm fudge brownie, two scoops of ice cream, toasted pecans and chocolate sauce.',
    price: 110,
    oldPrice: 130,
    image: '/assets/images/products/dessert-brownie-sundae.jpg',
    calories: 640,
    vegetarian: true,
  },
  {
    id: 'cookie-dough-bites',
    name: 'Cookie Dough Bites',
    category: 'desserts',
    description:
      'Six warm cookie bites with melting chocolate chunks. Made to share, rarely shared.',
    price: 75,
    image: '/assets/images/products/dessert-cookie.jpg',
    calories: 420,
    vegetarian: true,
  },
  {
    id: 'soft-serve-cone',
    name: 'Soft Serve Cone',
    category: 'desserts',
    description: 'Classic vanilla soft serve in a crisp wafer cone.',
    price: 35,
    image: '/assets/images/products/dessert-ice-cream.jpg',
    calories: 210,
    vegetarian: true,
    customizations: [
      {
        id: 'topping',
        label: 'Add a topping',
        type: 'single',
        required: true,
        options: [
          { id: 'none', label: 'Just the cone', price: 0 },
          { id: 'chocolate', label: 'Chocolate sauce', price: 12 },
          { id: 'caramel', label: 'Salted caramel', price: 12 },
          { id: 'strawberry', label: 'Strawberry swirl', price: 12 },
        ],
      },
    ],
  },

  /* ----------------------------------------------------------------- DRINKS */
  {
    id: 'cola',
    name: 'Cola',
    category: 'drinks',
    description: 'Ice-cold classic cola, served over crushed ice.',
    price: 35,
    image: '/assets/images/products/drink-cola.jpg',
    calories: 140,
    customizations: [sizeGroup(12)],
  },
  {
    id: 'orange-fizz',
    name: 'Orange Fizz',
    category: 'drinks',
    description: 'Sparkling orange with a squeeze of fresh juice.',
    price: 35,
    image: '/assets/images/products/drink-orange.jpg',
    calories: 150,
    customizations: [sizeGroup(12)],
  },
  {
    id: 'lemon-mint-cooler',
    name: 'Lemon and Mint Cooler',
    category: 'drinks',
    description: 'Fresh lemon blended with mint leaves and a little honey.',
    price: 55,
    image: '/assets/images/products/drink-lemon-mint.jpg',
    calories: 120,
    featured: true,
    popular: true,
  },
  {
    id: 'mango-smoothie',
    name: 'Mango Smoothie',
    category: 'drinks',
    description: 'Sweet mango blended with yoghurt and a pinch of cardamom.',
    price: 70,
    image: '/assets/images/products/drink-mango-smoothie.jpg',
    calories: 260,
  },
  {
    id: 'peach-iced-tea',
    name: 'Peach Iced Tea',
    category: 'drinks',
    description: 'Cold-brewed black tea with peach and a slice of lemon.',
    price: 45,
    image: '/assets/images/products/drink-iced-tea.jpg',
    calories: 110,
    customizations: [sizeGroup(12)],
  },
  {
    id: 'still-water',
    name: 'Still Water',
    category: 'drinks',
    description: 'Chilled 600ml bottle.',
    price: 20,
    image: '/assets/images/products/drink-water.jpg',
    calories: 0,
  },
  {
    id: 'iced-latte',
    name: 'Iced Latte',
    category: 'drinks',
    description: 'Double espresso poured over cold milk and ice.',
    price: 65,
    image: '/assets/images/products/drink-coffee.jpg',
    calories: 130,
    customizations: [
      {
        id: 'milk',
        label: 'Choose your milk',
        type: 'single',
        required: true,
        options: [
          { id: 'whole', label: 'Whole milk', price: 0 },
          { id: 'skimmed', label: 'Skimmed milk', price: 0 },
          { id: 'oat', label: 'Oat milk', price: 15 },
        ],
      },
    ],
  },

  /* ----------------------------------------------------------- FAMILY MEALS */
  {
    id: 'family-feast-bucket',
    name: 'Family Feast Bucket',
    category: 'family',
    description:
      '10 pieces of fried chicken, 4 regular fries, 2 coleslaw, 4 buns and a 1.25L drink. Feeds 4 to 5.',
    price: 795,
    oldPrice: 899,
    image: '/assets/images/products/family-feast-bucket.jpg',
    calories: 4200,
    featured: true,
    popular: true,
    customizations: [
      spiceGroup(),
      {
        id: 'family-drink',
        label: 'Choose your 1.25L drink',
        type: 'single',
        required: true,
        options: [
          { id: 'cola', label: 'Cola', price: 0 },
          { id: 'orange', label: 'Orange fizz', price: 0 },
          { id: 'iced-tea', label: 'Peach iced tea', price: 20 },
        ],
      },
      dipGroup(),
    ],
  },
  {
    id: 'family-burger-box',
    name: 'Family Burger Box',
    category: 'family',
    description:
      '4 burgers of your choice, 4 regular fries, 8 hot wings and 4 drinks. Feeds 4.',
    price: 685,
    image: '/assets/images/products/family-burger-box.jpg',
    calories: 3600,
    featured: true,
    customizations: [
      {
        id: 'burger-choice',
        label: 'Choose your burgers',
        type: 'single',
        required: true,
        options: [
          { id: 'all-classic', label: 'All Classic Flame', price: 0 },
          { id: 'all-crispy', label: 'All Crispy Chicken', price: 0 },
          { id: 'mixed', label: 'Mixed selection', price: 25 },
        ],
      },
    ],
  },
  {
    id: 'family-mixed-grill',
    name: 'Mixed Grill Platter',
    category: 'family',
    description:
      'Grilled chicken quarters, beef skewers, flatbread, rice and three dips on one big platter. Feeds 4.',
    price: 745,
    image: '/assets/images/products/family-mixed-grill.jpg',
    calories: 3100,
  },
  {
    id: 'family-pizza-night',
    name: 'Pizza Night Bundle',
    category: 'family',
    description:
      '2 large pizzas, garlic flatbread, 8 wings and a 1.25L drink. Feeds 4 to 5.',
    price: 645,
    oldPrice: 720,
    image: '/assets/images/products/family-pizza-night.jpg',
    calories: 3800,
    customizations: [
      {
        id: 'pizza-choice',
        label: 'Choose your two pizzas',
        type: 'single',
        required: true,
        options: [
          { id: 'classic-pair', label: 'Margherita + Double Pepperoni', price: 0 },
          { id: 'meat-pair', label: 'BBQ Chicken + Spicy Beef', price: 30 },
          { id: 'veg-pair', label: 'Margherita + Four Cheese', price: 20 },
        ],
      },
    ],
  },
]

/* -- Lookups ---------------------------------------------------------------
   Small helpers so components never filter the raw array themselves.         */

export function getItemById(itemId) {
  return menuItems.find((item) => item.id === itemId)
}

export function getItemsByCategory(categoryId) {
  return menuItems.filter((item) => item.category === categoryId)
}

export function getFeaturedItems() {
  return menuItems.filter((item) => item.featured)
}

export function getPopularItems() {
  return menuItems.filter((item) => item.popular)
}

/** Items from the same category, minus the one currently being viewed. */
export function getRelatedItems(item, limit = 4) {
  return menuItems
    .filter((other) => other.category === item.category && other.id !== item.id)
    .slice(0, limit)
}
