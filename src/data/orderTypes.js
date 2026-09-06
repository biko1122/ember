/**
 * The three ways a customer can receive an order.
 *
 * The `id` values are used throughout the app — by the cart (to decide whether
 * a delivery fee applies), by checkout (to decide which steps to show) and by
 * branches (to say which services they offer). Keep them stable.
 */
export const ORDER_TYPES = {
  DELIVERY: 'delivery',
  PICKUP: 'pickup',
  DINE_IN: 'dine-in',
}

export const orderTypes = [
  {
    id: ORDER_TYPES.DELIVERY,
    label: 'Delivery',
    tagline: 'Deliver to my location',
    description: 'Hot food brought straight to your door.',
    icon: 'truck',
    /** Shown on the order-type cards so the promise is clear up front. */
    estimate: '35–50 min',
    requiresAddress: true,
    requiresBranch: false,
  },
  {
    id: ORDER_TYPES.PICKUP,
    label: 'Pickup',
    tagline: 'Pick up from a branch',
    description: 'Order ahead and collect it when it is ready.',
    icon: 'bag',
    estimate: '15–20 min',
    requiresAddress: false,
    requiresBranch: true,
  },
  {
    id: ORDER_TYPES.DINE_IN,
    label: 'Dine In',
    tagline: 'I am eating at the restaurant',
    description: 'Order from your table and we will bring it over.',
    icon: 'plate',
    estimate: '10–15 min',
    requiresAddress: false,
    requiresBranch: true,
  },
]

export function getOrderType(orderTypeId) {
  return orderTypes.find((type) => type.id === orderTypeId) ?? orderTypes[0]
}
