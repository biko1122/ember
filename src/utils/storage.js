/**
 * Thin wrapper around localStorage.
 *
 * Everything the demo persists goes through here, so there is exactly one
 * place to swap when you move this data to a real backend. It also keeps the
 * app from crashing in private-browsing modes where localStorage throws.
 */

const PREFIX = 'ember'

export const STORAGE_KEYS = {
  cart: `${PREFIX}.cart`,
  orderType: `${PREFIX}.orderType`,
  promo: `${PREFIX}.promo`,
  branch: `${PREFIX}.branch`,
  user: `${PREFIX}.user`,
  accounts: `${PREFIX}.accounts`,
  orders: `${PREFIX}.orders`,
  favorites: `${PREFIX}.favorites`,
  addresses: `${PREFIX}.addresses`,
  /** Ember Rewards ledgers, keyed by account id. */
  loyalty: `${PREFIX}.loyalty`,
}

export function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or blocked — the app still works, it just will not persist.
  }
}

export function removeStorage(key) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Nothing to do.
  }
}
