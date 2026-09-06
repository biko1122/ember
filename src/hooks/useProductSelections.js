import { useMemo, useState } from 'react'
import { calculateUnitPrice, getDefaultSelections, getMissingRequiredGroups } from '@/utils/cart'

/**
 * Holds the state of "which options has the customer picked, and how many".
 *
 * Shared by the product modal and the full product page so both behave the
 * same way and price the item identically.
 */
export function useProductSelections(item) {
  const [selections, setSelections] = useState(() => (item ? getDefaultSelections(item) : {}))
  const [quantity, setQuantity] = useState(1)

  /** Handles both single-choice (replace) and multi-choice (toggle) groups. */
  const selectOption = (group, optionId) => {
    setSelections((current) => {
      if (group.type !== 'multiple') {
        return { ...current, [group.id]: optionId }
      }

      const chosen = current[group.id] ?? []
      return {
        ...current,
        [group.id]: chosen.includes(optionId)
          ? chosen.filter((id) => id !== optionId)
          : [...chosen, optionId],
      }
    })
  }

  const isSelected = (group, optionId) => {
    const value = selections[group.id]
    return Array.isArray(value) ? value.includes(optionId) : value === optionId
  }

  const unitPrice = useMemo(
    () => (item ? calculateUnitPrice(item, selections) : 0),
    [item, selections],
  )

  const missingGroups = useMemo(
    () => (item ? getMissingRequiredGroups(item, selections) : []),
    [item, selections],
  )

  return {
    selections,
    selectOption,
    isSelected,
    quantity,
    setQuantity,
    unitPrice,
    totalPrice: unitPrice * quantity,
    missingGroups,
    isValid: missingGroups.length === 0,
  }
}
