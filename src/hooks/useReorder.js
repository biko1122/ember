import { useCallback } from 'react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { getItemById } from '@/data/menu'

/**
 * Puts every line from a past order back into the basket, keeping the options
 * that were chosen the first time. Items no longer on the menu are skipped.
 */
export function useReorder() {
  const { addItem, openCart } = useCart()
  const { showToast } = useToast()

  return useCallback(
    (order) => {
      let addedCount = 0

      for (const line of order.lines) {
        const item = getItemById(line.itemId)
        if (!item) continue
        addItem(item, line.selections, line.quantity)
        addedCount += 1
      }

      if (addedCount === 0) {
        showToast('None of these items are on the menu any more.', { variant: 'error' })
        return
      }

      const skippedCount = order.lines.length - addedCount
      showToast(
        skippedCount > 0
          ? `Added to your basket — ${skippedCount} item(s) are no longer available.`
          : 'Added to your basket',
      )
      openCart()
    },
    [addItem, openCart, showToast],
  )
}
