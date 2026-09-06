import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { STORAGE_KEYS } from '@/utils/storage'
import * as authService from '@/services/authService'

/**
 * Who is signed in.
 *
 * -------------------------------------------------------------------------
 * PROTOTYPE ONLY — this is not real authentication. Accounts live in this
 * browser and signing in only changes what this device shows. See
 * services/authService.js, which is the single file the backend replaces.
 * -------------------------------------------------------------------------
 *
 * Every action here is async and returns `{ user }` or `{ error, fieldErrors }`
 * rather than throwing, because each caller is a form that needs to put the
 * message somewhere. The stored session is read synchronously on the first
 * render, so a signed-in customer never sees the logged-out navbar flash past.
 */

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(authService.restoreSession)
  const [addresses, setAddresses] = useLocalStorage(STORAGE_KEYS.addresses, [])

  // Make sure the sample account exists so a client can sign in without
  // registering first. This does not gate rendering — nothing on screen is
  // waiting on it.
  useEffect(() => {
    authService.ensureDemoAccount().catch((error) => {
      console.error('[auth] could not prepare the demo account', error)
    })
  }, [])

  /** Turns a rejected service call into the shape forms expect. */
  const asFormResult = (error) => ({
    error: error?.message ?? 'Something went wrong. Please try again.',
    fieldErrors: error?.fieldErrors ?? null,
  })

  const signup = useCallback(async (values) => {
    try {
      const created = await authService.signup(values)
      setUser(created)
      return { user: created }
    } catch (error) {
      return asFormResult(error)
    }
  }, [])

  const login = useCallback(async (values) => {
    try {
      const signedIn = await authService.login(values)
      setUser(signedIn)
      return { user: signedIn }
    } catch (error) {
      return asFormResult(error)
    }
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  const updateProfile = useCallback(
    async (changes) => {
      if (!user) return { error: 'You are not signed in.' }
      try {
        const updated = await authService.updateProfile(user.id, changes)
        setUser(updated)
        return { user: updated }
      } catch (error) {
        return asFormResult(error)
      }
    },
    [user],
  )

  const changePassword = useCallback(
    async (values) => {
      if (!user) return { error: 'You are not signed in.' }
      try {
        await authService.changePassword(user.id, values)
        return { ok: true }
      } catch (error) {
        return asFormResult(error)
      }
    },
    [user],
  )

  const requestPasswordReset = useCallback(async (email) => {
    try {
      await authService.requestPasswordReset(email)
      return { ok: true }
    } catch (error) {
      return asFormResult(error)
    }
  }, [])

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
      changePassword,
      requestPasswordReset,
      saveAddress,
      removeAddress,
    }),
    [
      user,
      addresses,
      signup,
      login,
      logout,
      updateProfile,
      changePassword,
      requestPasswordReset,
      saveAddress,
      removeAddress,
    ],
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
