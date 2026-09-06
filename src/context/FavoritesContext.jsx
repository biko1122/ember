import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { STORAGE_KEYS } from '@/utils/storage'

/**
 * Saved items, kept on the device so guests can favourite things too.
 *
 * This is a context rather than a plain hook because several hearts are on
 * screen at once — they all have to read and write the same list.
 */

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useLocalStorage(STORAGE_KEYS.favorites, [])

  const isFavorite = useCallback((itemId) => favoriteIds.includes(itemId), [favoriteIds])

  const toggleFavorite = useCallback(
    (itemId) => {
      setFavoriteIds((current) =>
        current.includes(itemId)
          ? current.filter((id) => id !== itemId)
          : [...current, itemId],
      )
    },
    [setFavoriteIds],
  )

  const value = useMemo(
    () => ({ favoriteIds, isFavorite, toggleFavorite }),
    [favoriteIds, isFavorite, toggleFavorite],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used inside a <FavoritesProvider>.')
  }
  return context
}
