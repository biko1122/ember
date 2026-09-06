import { useEffect, useState } from 'react'

/**
 * Delays a fast-changing value — used so the menu does not re-filter on every
 * single keystroke while someone is typing a search.
 */
export function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
