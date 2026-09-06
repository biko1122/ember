import { useCallback, useEffect, useState } from 'react'
import * as ordersService from '@/services/ordersService'
import { toDisplayError } from '@/services/mockApi'

/**
 * Order history.
 *
 * DEMO NOTE: orders are stored on this device only — see
 * services/ordersService.js, the one file the backend replaces.
 *
 * Each screen that calls this keeps its own copy, which is fine because the
 * stored orders are the single source of truth and every screen reads them
 * fresh when it mounts.
 */
export function useOrders() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isCurrent = true

    ordersService
      .fetchOrders()
      .then((loaded) => {
        if (isCurrent) setOrders(loaded)
      })
      .catch((caught) => {
        if (isCurrent) setError(toDisplayError(caught))
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [])

  /**
   * Saves a finished order. Resolves with the order, or `{ error }` if it
   * could not be saved — checkout shows that rather than navigating away.
   */
  const placeOrder = useCallback(async (draft) => {
    try {
      const order = await ordersService.placeOrder(draft)
      setOrders((current) => [order, ...current])
      return { order }
    } catch (caught) {
      return { error: toDisplayError(caught) }
    }
  }, [])

  const getOrder = useCallback(
    (orderNumber) => orders.find((order) => order.orderNumber === orderNumber),
    [orders],
  )

  return { orders, isLoading, error, placeOrder, getOrder }
}
