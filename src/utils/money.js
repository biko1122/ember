import { orderSettings } from '@/config/restaurant'

/**
 * Formats a number as a price, e.g. formatPrice(189) -> "EGP 189".
 * Whole numbers stay whole; anything with a fraction shows two decimals.
 */
export function formatPrice(amount) {
  const rounded = Math.round(amount * 100) / 100
  const hasFraction = rounded % 1 !== 0
  const formatted = rounded.toLocaleString('en-EG', {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  })
  return `${orderSettings.currency} ${formatted}`
}

/** "+ EGP 20" for an optional extra. Returns an empty string when free. */
export function formatSurcharge(amount) {
  if (!amount) return ''
  return `+ ${formatPrice(amount)}`
}

/** How much cheaper the new price is, as a whole percentage. */
export function calculateDiscountPercentage(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return 0
  return Math.round(((oldPrice - price) / oldPrice) * 100)
}
