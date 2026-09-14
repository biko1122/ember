import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Whether the visitor has asked their system to keep animation down.
 *
 * global.css already flattens CSS animation for these visitors, but some
 * motion is decided in JavaScript — a carousel that advances on its own, for
 * one — and CSS cannot switch that off. This is how a component asks.
 *
 * It listens rather than reading once, so toggling the setting takes effect
 * without a reload.
 */
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia?.(QUERY).matches ?? false,
  )

  useEffect(() => {
    const media = window.matchMedia?.(QUERY)
    if (!media) return undefined

    const handleChange = (event) => setPrefersReducedMotion(event.matches)

    setPrefersReducedMotion(media.matches)
    media.addEventListener('change', handleChange)

    return () => media.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}
