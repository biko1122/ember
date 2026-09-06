import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { SearchBar } from '@/components/SearchBar/SearchBar'
import { CategoryNavigation } from '@/components/CategoryNavigation/CategoryNavigation'
import { ProductGrid } from '@/components/ProductGrid/ProductGrid'
import { EmptyState } from '@/components/EmptyState/EmptyState'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { menuItems, getFeaturedItems } from '@/data/menu'
import { FEATURED_CATEGORY_ID, getCategoryById } from '@/data/categories'
import { searchMenuItems, sortMenuItems, SORT_OPTIONS } from '@/utils/search'
import styles from './Menu.module.css'

/**
 * The full menu: search, category filter and sorting.
 *
 * The category and the search term live in the URL (?category=burgers&q=cheese)
 * so a filtered menu can be linked to and survives a refresh.
 */
export function Menu() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sortId, setSortId] = useState('recommended')

  const activeCategory = searchParams.get('category') ?? FEATURED_CATEGORY_ID
  const query = searchParams.get('q') ?? ''
  const debouncedQuery = useDebouncedValue(query, 200)

  const category = getCategoryById(activeCategory)

  useDocumentTitle(
    category ? `${category.name} menu` : 'Menu',
    'Browse the full menu — burgers, fried chicken, pizza, sides, desserts and family meals.',
  )

  /** Writes a single query param, dropping it when the value is empty. */
  const updateParam = (key, value) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (value) {
          next.set(key, value)
        } else {
          next.delete(key)
        }
        return next
      },
      { replace: true },
    )
  }

  const visibleItems = useMemo(() => {
    // A search looks across the whole menu; otherwise we stay in the category.
    const pool = debouncedQuery.trim()
      ? menuItems
      : activeCategory === FEATURED_CATEGORY_ID
        ? getFeaturedItems()
        : menuItems.filter((item) => item.category === activeCategory)

    return sortMenuItems(searchMenuItems(pool, debouncedQuery), sortId)
  }, [activeCategory, debouncedQuery, sortId])

  const isSearching = debouncedQuery.trim().length > 0

  return (
    <>
      <PageHeader
        eyebrow="Our menu"
        title={isSearching ? `Results for “${debouncedQuery}”` : (category?.name ?? 'Menu')}
        description={isSearching ? undefined : category?.description}
      >
        <SearchBar value={query} onChange={(value) => updateParam('q', value)} />
      </PageHeader>

      <CategoryNavigation
        activeCategory={activeCategory}
        onSelect={(categoryId) => updateParam('category', categoryId)}
        sticky
      />

      <div className={`page-container ${styles.results}`}>
        <div className={styles.toolbar}>
          <p className={styles.count}>
            {visibleItems.length} {visibleItems.length === 1 ? 'item' : 'items'}
          </p>

          <div className={styles.sort}>
            <label htmlFor="menu-sort" className={styles.sortLabel}>
              Sort by
            </label>
            <select
              id="menu-sort"
              className={styles.sortSelect}
              value={sortId}
              onChange={(event) => setSortId(event.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {visibleItems.length > 0 ? (
          <ProductGrid items={visibleItems} />
        ) : (
          <EmptyState
            icon="search"
            title="Nothing matched that search"
            description={`We could not find anything for “${debouncedQuery}”. Try a different word, or browse a category.`}
            actionLabel="Clear search"
            onAction={() => updateParam('q', '')}
          />
        )}
      </div>
    </>
  )
}
