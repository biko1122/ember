/**
 * The seam where the backend will plug in.
 *
 * -------------------------------------------------------------------------
 * PROTOTYPE ONLY — there is no server behind any of this.
 *
 * Every "request" in the app goes through `mockRequest`, which waits a beat and
 * then runs a plain function against data held in the browser. That gives the
 * prototype real loading states, real error states and real disabled buttons,
 * so the client experiences the timing of the finished product.
 *
 * WHEN THE BACKEND ARRIVES
 * Replace the body of each service function with a `fetch`. Keep them async and
 * keep them throwing `ApiError`, and not one component has to change.
 * -------------------------------------------------------------------------
 */

/** How long each class of request pretends to take, in milliseconds. */
export const LATENCY = {
  instant: 180,
  fast: 420,
  normal: 700,
  slow: 1100,
}

/**
 * The one error shape the UI knows how to display.
 *
 *   message      the sentence shown to the customer
 *   fieldErrors  optional { fieldName: 'message' }, merged into a form's errors
 */
export class ApiError extends Error {
  constructor(message, { fieldErrors = null, code = 'request_failed' } = {}) {
    super(message)
    this.name = 'ApiError'
    this.fieldErrors = fieldErrors
    this.code = code
  }
}

/**
 * Runs `resolver` after a short delay and resolves with whatever it returns.
 * If it throws an ApiError the promise rejects with it; anything else is
 * turned into a friendly message so a stray bug never reaches the customer as
 * a stack trace.
 */
export function mockRequest(resolver, { delay = LATENCY.normal } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(resolver())
      } catch (error) {
        if (error instanceof ApiError) {
          reject(error)
        } else {
          // Keep the real reason in the console for whoever is debugging, and
          // give the customer something they can act on.
          console.error('[mock api] unexpected failure', error)
          reject(new ApiError('Something went wrong on our end. Please try again.'))
        }
      }
    }, delay)
  })
}

/**
 * Turns anything thrown into a sentence safe to render.
 * Components use this in `catch` so no raw error ever reaches the screen.
 */
export function toDisplayError(error) {
  if (error instanceof ApiError) return error.message
  console.error('[unhandled]', error)
  return 'Something went wrong. Please try again.'
}

/**
 * SHA-256 of a password, so the prototype never keeps what someone typed.
 *
 * This is NOT authentication and is NOT a substitute for hashing on a server —
 * there is no salt, no work factor and no server. It exists only so a client
 * demoing the site cannot leave a password they actually use sitting in
 * localStorage in plain text. The real thing lands with the backend.
 */
export async function digestPassword(password) {
  if (!globalThis.crypto?.subtle) {
    // Older browsers, or an insecure origin. The demo still has to work.
    return `plain:${password}`
  }
  const bytes = new TextEncoder().encode(`ember::${password}`)
  const hash = await globalThis.crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}
