/**
 * Account service.
 *
 * -------------------------------------------------------------------------
 * PROTOTYPE ONLY. Accounts live in this browser. There is no server, no
 * session, and no real authentication — signing in only decides what this
 * device shows. It is enough to demonstrate the flow to a client.
 *
 * WHEN THE BACKEND ARRIVES
 * Each function below becomes a `fetch`. They already return the right shapes
 * and throw `ApiError`, so `AuthContext` and every page stay as they are.
 * -------------------------------------------------------------------------
 */

import { readStorage, writeStorage, STORAGE_KEYS } from '@/utils/storage'
import { ApiError, LATENCY, digestPassword, mockRequest } from '@/services/mockApi'

const readAccounts = () => readStorage(STORAGE_KEYS.accounts, [])
const writeAccounts = (accounts) => writeStorage(STORAGE_KEYS.accounts, accounts)

const normaliseEmail = (email) => email.trim().toLowerCase()
const normalisePhone = (phone) => phone.replace(/[\s-]/g, '')

/** The stored password digest never leaves this module. */
function toPublicUser(account) {
  const { passwordDigest, ...publicFields } = account
  return publicFields
}

/**
 * A pre-made account so a client can sign in without registering first.
 * Its credentials are printed on the login page.
 */
export const DEMO_CREDENTIALS = {
  email: 'demo@embereats.example',
  password: 'EmberDemo1',
}

/** Creates the demo account on first run if it is not already there. */
export async function ensureDemoAccount() {
  const accounts = readAccounts()
  if (accounts.some((account) => account.email === DEMO_CREDENTIALS.email)) return

  writeAccounts([
    ...accounts,
    {
      id: 'user-demo',
      firstName: 'Nour',
      lastName: 'Hassan',
      email: DEMO_CREDENTIALS.email,
      phone: '01001234567',
      passwordDigest: await digestPassword(DEMO_CREDENTIALS.password),
      joinedAt: new Date(Date.now() - 96 * 86400000).toISOString(),
    },
  ])
}

/**
 * Whoever was signed in last time this device was used.
 *
 * Deliberately synchronous: the session is sitting in localStorage, so making
 * this a "request" only bought a flash of the logged-out navbar on every page
 * load. When a real backend has to validate a token this becomes async again,
 * and AuthProvider grows a loading state to cover it.
 */
export function restoreSession() {
  return readStorage(STORAGE_KEYS.user, null)
}

export async function signup({ firstName, lastName, email, phone, password }) {
  const passwordDigest = await digestPassword(password)

  return mockRequest(
    () => {
      const accounts = readAccounts()
      const emailAddress = normaliseEmail(email)

      if (accounts.some((account) => account.email === emailAddress)) {
        throw new ApiError('An account with this email already exists. Try logging in instead.', {
          fieldErrors: { email: 'This email is already registered.' },
          code: 'email_taken',
        })
      }

      if (accounts.some((account) => normalisePhone(account.phone) === normalisePhone(phone))) {
        throw new ApiError('That phone number is already on another account.', {
          fieldErrors: { phone: 'This number is already registered.' },
          code: 'phone_taken',
        })
      }

      const account = {
        id: `user-${Date.now().toString(36)}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: emailAddress,
        phone: phone.trim(),
        passwordDigest,
        joinedAt: new Date().toISOString(),
      }

      writeAccounts([...accounts, account])
      const user = toPublicUser(account)
      writeStorage(STORAGE_KEYS.user, user)
      return user
    },
    { delay: LATENCY.slow },
  )
}

/** Signs in with either an email address or a phone number. */
export async function login({ identifier, password }) {
  const passwordDigest = await digestPassword(password)

  return mockRequest(
    () => {
      const needle = identifier.trim()
      const account = readAccounts().find(
        (candidate) =>
          candidate.email === normaliseEmail(needle) ||
          normalisePhone(candidate.phone) === normalisePhone(needle),
      )

      // Deliberately the same message either way — saying "no such account"
      // would tell a stranger which emails are registered.
      if (!account || account.passwordDigest !== passwordDigest) {
        throw new ApiError('Those details do not match an account. Check them and try again.', {
          code: 'invalid_credentials',
        })
      }

      const user = toPublicUser(account)
      writeStorage(STORAGE_KEYS.user, user)
      return user
    },
    { delay: LATENCY.normal },
  )
}

export function logout() {
  return mockRequest(
    () => {
      writeStorage(STORAGE_KEYS.user, null)
      return true
    },
    { delay: LATENCY.fast },
  )
}

export function updateProfile(userId, changes) {
  return mockRequest(
    () => {
      const accounts = readAccounts()
      const emailAddress = changes.email ? normaliseEmail(changes.email) : undefined

      if (
        emailAddress &&
        accounts.some((account) => account.email === emailAddress && account.id !== userId)
      ) {
        throw new ApiError('That email is already used by another account.', {
          fieldErrors: { email: 'This email is already registered.' },
        })
      }

      const updatedAccounts = accounts.map((account) =>
        account.id === userId
          ? { ...account, ...changes, ...(emailAddress ? { email: emailAddress } : {}) }
          : account,
      )
      writeAccounts(updatedAccounts)

      const user = toPublicUser(updatedAccounts.find((account) => account.id === userId))
      writeStorage(STORAGE_KEYS.user, user)
      return user
    },
    { delay: LATENCY.normal },
  )
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const [currentDigest, nextDigest] = await Promise.all([
    digestPassword(currentPassword),
    digestPassword(newPassword),
  ])

  return mockRequest(
    () => {
      const accounts = readAccounts()
      const account = accounts.find((candidate) => candidate.id === userId)

      if (!account || account.passwordDigest !== currentDigest) {
        throw new ApiError('Your current password is not right.', {
          fieldErrors: { currentPassword: 'That is not your current password.' },
        })
      }

      writeAccounts(
        accounts.map((candidate) =>
          candidate.id === userId ? { ...candidate, passwordDigest: nextDigest } : candidate,
        ),
      )
      return true
    },
    { delay: LATENCY.slow },
  )
}

/**
 * DEMO NOTE: a real reset emails a signed, expiring link. Nothing is sent here
 * — the UI exists so the flow can be shown, and it deliberately answers the
 * same way whether or not the address is registered.
 */
export function requestPasswordReset(email) {
  return mockRequest(() => normaliseEmail(email), { delay: LATENCY.slow })
}
