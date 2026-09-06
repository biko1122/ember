import { getCategoryName } from '@/data/categories'

/**
 * Menu search and sorting.
 *
 * Search looks at the product name, its description and its category name, so
 * typing "burger", "spicy" or "cheese" all return sensible results.
 */

export const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'name-asc', label: 'Name: A to Z' },
]

export function searchMenuItems(items, query) {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return items

  const terms = trimmed.split(/\s+/)

  return items.filter((item) => {
    const haystack = [item.name, item.description, getCategoryName(item.category)]
      .join(' ')
      .toLowerCase()
    return terms.every((term) => haystack.includes(term))
  })
}

export function sortMenuItems(items, sortId) {
  const sorted = [...items]

  switch (sortId) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    default:
      // "Recommended" floats featured items, then popular ones, to the top.
      return sorted.sort((a, b) => score(b) - score(a))
  }
}

function score(item) {
  return (item.featured ? 2 : 0) + (item.popular ? 1 : 0)
}
