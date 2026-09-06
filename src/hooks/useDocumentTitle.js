import { useEffect } from 'react'
import { restaurant } from '@/config/restaurant'

/**
 * Sets the browser tab title (and the meta description when one is given).
 * Every page calls this once so tab titles and search snippets stay accurate.
 */
export function useDocumentTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | ${restaurant.name}` : `${restaurant.name} — ${restaurant.tagline}`

    if (description) {
      const meta = document.querySelector('meta[name="description"]')
      if (meta) meta.setAttribute('content', description)
    }
  }, [title, description])
}
