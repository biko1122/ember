import { Icon } from '@/components/Icon/Icon'
import styles from './SearchBar.module.css'

/**
 * Controlled search input with a clear button.
 * The parent owns the value so it can debounce and filter however it likes.
 */
export function SearchBar({
  value,
  onChange,
  placeholder = 'Search the menu…',
  label = 'Search the menu',
  id = 'menu-search',
}) {
  return (
    <div className={styles.wrapper}>
      <label htmlFor={id} className="visually-hidden">
        {label}
      </label>

      <Icon name="search" size={19} className={styles.icon} />

      <input
        id={id}
        type="search"
        className={styles.input}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
      />

      {value && (
        <button
          type="button"
          className={styles.clear}
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <Icon name="close" size={16} />
        </button>
      )}
    </div>
  )
}
