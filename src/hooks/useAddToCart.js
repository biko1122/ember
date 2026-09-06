import { useCallback } from 'react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { getDefaultSelections } from '@/utils/cart'

/**
 * Adds a product to the basket and confirms it with a toast.
 * Used by the product card, the product modal and the product page so the
 * behaviour is identical wherever someone taps "Add".
 */
export function useAddToCart() {
  const { addItem } = useCart()
  const { showToast } = useToast()

  return useCallback(
    (item, selections = getDefaultSelections(item), quantity = 1) => {
      addItem(item, selections, quantity)
      showToast(`${quantity} × ${item.name} added to your basket`)
    },
    [addItem, showToast],
  )
}
