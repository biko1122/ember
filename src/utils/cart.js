import { orderSettings, promoCodes } from '@/config/restaurant'
import { ORDER_TYPES } from '@/data/orderTypes'

/**
 * Cart maths and the shape of a cart line.
 *
 * A "selection" object maps a customization group id to what the customer
 * picked in it:
 *
 *   { size: 'large', extras: ['extra-cheese', 'bacon'] }
 *
 * Single-choice groups store one option id, multi-choice groups store an array.
 */

/** Sensible starting selections: first option for every required single group. */
export function getDefaultSelections(item) {
  const selections = {}
  for (const group of item.customizations ?? []) {
    if (group.type === 'multiple') {
      selections[group.id] = []
    } else if (group.required) {
      selections[group.id] = group.options[0].id
    } else {
      selections[group.id] = null
    }
  }
  return selections
}

/** Flattens selections into a printable list of chosen options. */
export function getSelectedOptions(item, selections = {}) {
  const chosen = []
  for (const group of item.customizations ?? []) {
    const value = selections[group.id]
    const ids = Array.isArray(value) ? value : [value].filter(Boolean)

    for (const optionId of ids) {
      const option = group.options.find((candidate) => candidate.id === optionId)
      if (option) {
        chosen.push({
          groupId: group.id,
          groupLabel: group.label,
          optionId: option.id,
          label: option.label,
          price: option.price,
        })
      }
    }
  }
  return chosen
}

/** Base price plus every selected option's surcharge — for one unit. */
export function calculateUnitPrice(item, selections = {}) {
  const extras = getSelectedOptions(item, selections)
  return extras.reduce((total, option) => total + option.price, item.price)
}

/** Required single-choice groups the customer has not answered yet. */
export function getMissingRequiredGroups(item, selections = {}) {
  return (item.customizations ?? []).filter((group) => {
    if (!group.required) return false
    const value = selections[group.id]
    return Array.isArray(value) ? value.length === 0 : !value
  })
}

/**
 * Identity of a cart line. Two lines merge only when they are the same product
 * with exactly the same options, so "burger with cheese" and "burger without"
 * stay separate rows.
 */
export function createLineId(itemId, selections = {}) {
  const signature = Object.keys(selections)
    .sort()
    .map((groupId) => {
      const value = selections[groupId]
      const ids = Array.isArray(value) ? [...value].sort() : [value]
      return `${groupId}:${ids.filter(Boolean).join('+')}`
    })
    .filter((part) => !part.endsWith(':'))
    .join('|')

  return signature ? `${itemId}__${signature}` : itemId
}

/** Builds the object stored in the cart for one product + option combination. */
export function createCartLine(item, selections = {}, quantity = 1) {
  const options = getSelectedOptions(item, selections)
  return {
    lineId: createLineId(item.id, selections),
    itemId: item.id,
    name: item.name,
    image: item.image,
    category: item.category,
    basePrice: item.price,
    unitPrice: calculateUnitPrice(item, selections),
    selections,
    options,
    quantity,
  }
}

/** "Large · Extra cheese, Bacon" — the grey line under a cart item's name. */
export function summariseOptions(options = []) {
  if (options.length === 0) return ''
  return options.map((option) => option.label).join(' · ')
}

/** Looks up a promo code, ignoring case and surrounding spaces. */
export function findPromoCode(code) {
  if (!code) return null
  const normalised = code.trim().toUpperCase()
  return promoCodes.find((promo) => promo.code === normalised) ?? null
}

/**
 * Every number the cart and checkout summaries display.
 * Keeping this in one pure function means the basket page, the drawer and the
 * order review can never disagree about the total.
 */
export function calculateTotals({ lines = [], orderType = ORDER_TYPES.DELIVERY, promo = null }) {
  const subtotal = lines.reduce((total, line) => total + line.unitPrice * line.quantity, 0)

  const chargesDelivery =
    orderType === ORDER_TYPES.DELIVERY &&
    subtotal > 0 &&
    !(orderSettings.freeDeliveryAbove !== null && subtotal >= orderSettings.freeDeliveryAbove)

  let deliveryFee = chargesDelivery ? orderSettings.deliveryFee : 0

  let discount = 0
  if (promo) {
    const meetsMinimum = !promo.minimumOrder || subtotal >= promo.minimumOrder
    if (meetsMinimum) {
      if (promo.type === 'percentage') {
        discount = Math.round(subtotal * (promo.value / 100))
      } else if (promo.type === 'fixed') {
        discount = Math.min(promo.value, subtotal)
      } else if (promo.type === 'delivery') {
        discount = 0
        deliveryFee = 0
      }
    }
  }

  const tax = Math.round(subtotal * orderSettings.taxRate)
  const total = Math.max(0, subtotal - discount + deliveryFee + tax)

  return { subtotal, deliveryFee, discount, tax, total }
}

/** Whether a delivery basket clears the minimum order value. */
export function meetsMinimumOrder(subtotal, orderType) {
  if (orderType !== ORDER_TYPES.DELIVERY) return true
  return subtotal >= orderSettings.minimumDeliveryOrder
}
