import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { STORAGE_KEYS } from '@/utils/storage'

/**
 * Demo authentication.
 *
 * -------------------------------------------------------------------------
 * THIS IS NOT REAL AUTHENTICATION.
 * Accounts are kept in localStorage on this device and passwords are stored
 * in plain text. It exists so the UI has something to talk to.
 *
 * To connect a real backend, replace the bodies of `signup`, `login` and
 * `logout` with API calls and keep the returned shape the same — no component
 * needs to change, because they all go through this hook.
 * -------------------------------------------------------------------------
 */

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [accounts, setAccounts] = useLocalStorage(STORAGE_KEYS.accounts, [])
  const [user, setUser] = useLocalStorage(STORAGE_KEYS.user, null)
  const [addresses, setAddresses] = useLocalStorage(STORAGE_KEYS.addresses, [])

  /** Creates an account and signs in. Returns { error } on failure. */
  const signup = useCallback(
    ({ firstName, lastName, email, phone, password }) => {
      const emailTaken = accounts.some(
        (account) => account.email.toLowerCase() === email.trim().toLowerCase(),
      )
      if (emailTaken) {
        return { error: 'An account with this email already exists. Try logging in.' }
      }

      const account = {
        id: `user-${accounts.length + 1}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password, // Demo only — a real backend would hash this server-side.
        joinedAt: new Date().toISOString(),
      }

      setAccounts((current) => [...current, account])
      setUser(withoutPassword(account))
      return { user: withoutPassword(account) }
    },
    [accounts, setAccounts, setUser],
  )

  /** Signs in with either an email or a phone number. */
  const login = useCallback(
    ({ identifier, password }) => {
      const needle = identifier.trim().toLowerCase()
      const account = accounts.find(
        (candidate) =>
          candidate.email.toLowerCase() === needle || candidate.phone === identifier.trim(),
      )

      if (!account || account.password !== password) {
        return { error: 'Those details do not match an account. Check and try again.' }
      }

      setUser(withoutPassword(account))
      return { user: withoutPassword(account) }
    },
    [accounts, setUser],
  )

  const logout = useCallback(() => setUser(null), [setUser])

  /** Edits the signed-in customer's own details. */
  const updateProfile = useCallback(
    (changes) => {
      setUser((current) => (current ? { ...current, ...changes } : current))
      setAccounts((current) =>
        current.map((account) =>
          account.id === user?.id ? { ...account, ...changes } : account,
        ),
      )
    },
    [setAccounts, setUser, user?.id],
  )

  const saveAddress = useCallback(
    (address) => {
      const saved = { ...address, id: address.id ?? `address-${Date.now()}` }
      setAddresses((current) => {
        const exists = current.some((entry) => entry.id === saved.id)
        return exists
          ? current.map((entry) => (entry.id === saved.id ? saved : entry))
          : [...current, saved]
      })
      return saved
    },
    [setAddresses],
  )

  const removeAddress = useCallback(
    (addressId) => setAddresses((current) => current.filter((entry) => entry.id !== addressId)),
    [setAddresses],
  )

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      addresses,
      signup,
      login,
      logout,
      updateProfile,
      saveAddress,
      removeAddress,
    }),
    [user, addresses, signup, login, logout, updateProfile, saveAddress, removeAddress],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside an <AuthProvider>.')
  }
  return context
}

/** Never let the stored password reach the signed-in user object. */
function withoutPassword(account) {
  const { password, ...safeAccount } = account
  return safeAccount
}
