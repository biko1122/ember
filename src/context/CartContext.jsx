import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { STORAGE_KEYS } from '@/utils/storage'
import {
  calculateTotals,
  createCartLine,
  findPromoCode,
  meetsMinimumOrder,
} from '@/utils/cart'
import { ORDER_TYPES } from '@/data/orderTypes'

/**
 * The basket, plus the two choices that change what the basket costs:
 * how the order is being collected, and from which branch.
 *
 * Everything is persisted to localStorage, so a refresh never loses an order
 * in progress.
 */

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [lines, setLines] = useLocalStorage(STORAGE_KEYS.cart, [])
  const [orderType, setOrderType] = useLocalStorage(STORAGE_KEYS.orderType, ORDER_TYPES.DELIVERY)
  const [branchId, setBranchId] = useLocalStorage(STORAGE_KEYS.branch, null)
  const [promoCode, setPromoCode] = useLocalStorage(STORAGE_KEYS.promo, null)

  // The slide-out mini cart. UI state, so it is deliberately not persisted.
  const [isCartOpen, setIsCartOpen] = useState(false)

  const promo = useMemo(() => findPromoCode(promoCode), [promoCode])

  /** Adds a product. Identical option combinations stack into one line. */
  const addItem = useCallback(
    (item, selections = {}, quantity = 1) => {
      const newLine = createCartLine(item, selections, quantity)

      setLines((current) => {
        const existing = current.find((line) => line.lineId === newLine.lineId)
        if (!existing) return [...current, newLine]

        return current.map((line) =>
          line.lineId === newLine.lineId
            ? { ...line, quantity: line.quantity + quantity }
            : line,
        )
      })

      return newLine
    },
    [setLines],
  )

  const updateQuantity = useCallback(
    (lineId, quantity) => {
      if (quantity < 1) {
        setLines((current) => current.filter((line) => line.lineId !== lineId))
        return
      }
      setLines((current) =>
        current.map((line) => (line.lineId === lineId ? { ...line, quantity } : line)),
      )
    },
    [setLines],
  )

  const removeLine = useCallback(
    (lineId) => setLines((current) => current.filter((line) => line.lineId !== lineId)),
    [setLines],
  )

  const clearCart = useCallback(() => {
    setLines([])
    setPromoCode(null)
  }, [setLines, setPromoCode])

  /** Returns an error message when the code is unknown, otherwise null. */
  const applyPromoCode = useCallback(
    (code) => {
      const match = findPromoCode(code)
      if (!match) return 'We do not recognise that code.'

      if (match.minimumOrder && subtotalOf(lines) < match.minimumOrder) {
        return `This code needs a minimum order of EGP ${match.minimumOrder}.`
      }

      setPromoCode(match.code)
      return null
    },
    [lines, setPromoCode],
  )

  const removePromoCode = useCallback(() => setPromoCode(null), [setPromoCode])

  const totals = useMemo(
    () => calculateTotals({ lines, orderType, promo }),
    [lines, orderType, promo],
  )

  const itemCount = useMemo(
    () => lines.reduce((count, line) => count + line.quantity, 0),
    [lines],
  )

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      totals,
      promo,
      orderType,
      branchId,
      isEmpty: lines.length === 0,
      canCheckout: lines.length > 0 && meetsMinimumOrder(totals.subtotal, orderType),

      addItem,
      updateQuantity,
      removeLine,
      clearCart,
      applyPromoCode,
      removePromoCode,
      setOrderType,
      setBranchId,

      isCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
    }),
    [
      lines,
      itemCount,
      totals,
      promo,
      orderType,
      branchId,
      addItem,
      updateQuantity,
      removeLine,
      clearCart,
      applyPromoCode,
      removePromoCode,
      setOrderType,
      setBranchId,
      isCartOpen,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside a <CartProvider>.')
  }
  return context
}

function subtotalOf(lines) {
  return lines.reduce((total, line) => total + line.unitPrice * line.quantity, 0)
}
