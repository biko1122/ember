import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Keeps scroll position sensible between routes: jump to the top on a new
 * page, or to the matching element when the link carries a #hash.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }

    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}
