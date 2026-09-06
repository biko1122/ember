/**
 * Menu categories, in the order they appear in the category bar.
 *
 * `id` is what menu items reference through their `category` field.
 * FEATURED_CATEGORY_ID is a virtual category — it has no items of its own and
 * instead collects every item flagged `featured: true`.
 */
export const FEATURED_CATEGORY_ID = 'featured'

export const categories = [
  {
    id: 'featured',
    name: 'Featured',
    description: "This week's most ordered plates.",
    image: '/assets/images/categories/category-featured.jpg',
  },
  {
    id: 'meals',
    name: 'Meals',
    description: 'A main, a side and a drink — sorted.',
    image: '/assets/images/categories/category-meals.jpg',
  },
  {
    id: 'burgers',
    name: 'Burgers',
    description: 'Flame-grilled patties in a toasted brioche bun.',
    image: '/assets/images/categories/category-burgers.jpg',
  },
  {
    id: 'chicken',
    name: 'Chicken',
    description: 'Marinated overnight, breaded and fried to order.',
    image: '/assets/images/categories/category-chicken.jpg',
  },
  {
    id: 'pizza',
    name: 'Pizza',
    description: 'Stone-baked, thin and blistered at the edges.',
    image: '/assets/images/categories/category-pizza.jpg',
  },
  {
    id: 'sandwiches',
    name: 'Sandwiches',
    description: 'Handheld, generous and stacked with the good stuff.',
    image: '/assets/images/categories/category-sandwiches.jpg',
  },
  {
    id: 'sides',
    name: 'Sides',
    description: 'The bit everyone fights over.',
    image: '/assets/images/categories/category-sides.jpg',
  },
  {
    id: 'desserts',
    name: 'Desserts',
    description: 'Because you have room. You always do.',
    image: '/assets/images/categories/category-desserts.jpg',
  },
  {
    id: 'drinks',
    name: 'Drinks',
    description: 'Cold, fizzy, fresh or fruity.',
    image: '/assets/images/categories/category-drinks.jpg',
  },
  {
    id: 'family',
    name: 'Family Meals',
    description: 'Built to feed the whole table.',
    image: '/assets/images/categories/category-family.jpg',
  },
]

/** Look up a single category by id (used by the menu page + breadcrumbs). */
export function getCategoryById(categoryId) {
  return categories.find((category) => category.id === categoryId)
}

/** Human-readable name for a category id, e.g. 'burgers' -> 'Burgers'. */
export function getCategoryName(categoryId) {
  return getCategoryById(categoryId)?.name ?? categoryId
}
