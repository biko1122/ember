import { useEffect, useRef } from 'react'
import { categories } from '@/data/categories'
import styles from './CategoryNavigation.module.css'

/**
 * The horizontal category bar. Scrolls sideways on small screens and keeps the
 * selected chip in view when the category changes.
 *
 * Categories come from data/categories.js — add one there and it shows up here.
 */
export function CategoryNavigation({ activeCategory, onSelect, sticky = false }) {
  const listRef = useRef(null)

  useEffect(() => {
    const activeChip = listRef.current?.querySelector('[data-active="true"]')
    activeChip?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [activeCategory])

  return (
    <nav className={`${styles.bar} ${sticky ? styles.sticky : ''}`} aria-label="Menu categories">
      <div className="page-container">
        <ul className={styles.list} ref={listRef}>
          {categories.map((category) => {
            const isActive = category.id === activeCategory

            return (
              <li key={category.id}>
                <button
                  type="button"
                  className={styles.chip}
                  data-active={isActive}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => onSelect(category.id)}
                >
                  {category.name}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
