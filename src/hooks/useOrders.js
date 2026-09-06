import { useCallback, useState } from 'react'
import { readStorage, writeStorage, STORAGE_KEYS } from '@/utils/storage'
import { createOrderNumber } from '@/utils/orders'

/**
 * Order history.
 *
 * DEMO NOTE: orders are stored on this device only. To connect a backend,
 * replace the read below with a fetch and `placeOrder` with a POST — the rest
 * of the app only uses the functions returned here.
 *
 * The write happens immediately rather than in an effect: checkout navigates
 * away in the same click that places the order, so an effect on the checkout
 * page would never get the chance to run.
 */
export function useOrders() {
  const [orders, setOrders] = useState(() => readStorage(STORAGE_KEYS.orders, []))

  /** Saves a finished order and returns it, so checkout can route to it. */
  const placeOrder = useCallback(
    (draft) => {
      const order = {
        ...draft,
        orderNumber: createOrderNumber(orders),
        placedAt: new Date().toISOString(),
      }

      const updatedOrders = [order, ...orders]
      writeStorage(STORAGE_KEYS.orders, updatedOrders)
      setOrders(updatedOrders)

      return order
    },
    [orders],
  )

  const getOrder = useCallback(
    (orderNumber) => orders.find((order) => order.orderNumber === orderNumber),
    [orders],
  )

  return { orders, placeOrder, getOrder }
}
