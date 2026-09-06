/**
 * Orders service.
 *
 * -------------------------------------------------------------------------
 * PROTOTYPE ONLY. Orders are written to this browser. Nothing reaches a
 * kitchen, no payment is taken, and the status on the tracker is worked out
 * from the time since the order was placed (see utils/orders.js).
 *
 * WHEN THE BACKEND ARRIVES
 * `fetchOrders` becomes a GET and `placeOrder` a POST that returns the created
 * order. The order number and the points earned then come from the server
 * rather than being worked out here.
 * -------------------------------------------------------------------------
 */

import { readStorage, writeStorage, STORAGE_KEYS } from '@/utils/storage'
import { ApiError, LATENCY, mockRequest } from '@/services/mockApi'
import { createOrderNumber } from '@/utils/orders'

export function fetchOrders() {
  return mockRequest(() => readStorage(STORAGE_KEYS.orders, []), { delay: LATENCY.fast })
}

/**
 * Saves a finished order and returns it, so checkout can route to it.
 * Deliberately slower than the other calls — placing an order is the moment a
 * customer expects the site to be doing something.
 */
export function placeOrder(draft) {
  return mockRequest(
    () => {
      if (!draft.lines?.length) {
        throw new ApiError('Your basket is empty.')
      }

      const orders = readStorage(STORAGE_KEYS.orders, [])
      const order = {
        ...draft,
        orderNumber: createOrderNumber(orders),
        placedAt: new Date().toISOString(),
      }

      writeStorage(STORAGE_KEYS.orders, [order, ...orders])
      return order
    },
    { delay: LATENCY.slow },
  )
}
