import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import * as loyaltyService from '@/services/loyaltyService'
import { toDisplayError } from '@/services/mockApi'
import {
  getNextReward,
  getTier,
  getTierProgress,
  pointsForOrder,
  sortLedger,
  summariseLedger,
} from '@/data/loyalty'

/**
 * Ember Rewards state.
 *
 * -------------------------------------------------------------------------
 * PROTOTYPE ONLY. Points are worked out in the browser — see
 * services/loyaltyService.js, the one file the backend replaces.
 * -------------------------------------------------------------------------
 *
 * The balance is never stored. It is summed from the ledger every render, so
 * the number on screen and the history that explains it cannot disagree — the
 * same rule the server will follow later.
 */

const LoyaltyContext = createContext(null)

export function LoyaltyProvider({ children }) {
  const { user, isLoggedIn } = useAuth()

  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [redeemingRewardId, setRedeemingRewardId] = useState(null)

  // Load the signed-in member's ledger; clear it on the way out.
  useEffect(() => {
    if (!user) {
      setEntries([])
      setError(null)
      setIsLoading(false)
      return undefined
    }

    let isCurrent = true
    setIsLoading(true)
    setError(null)

    loyaltyService
      .fetchLedger(user.id)
      .then((loaded) => {
        if (isCurrent) setEntries(loaded)
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
  }, [user])

  const totals = useMemo(() => summariseLedger(entries), [entries])
  const tier = useMemo(() => getTier(totals.lifetimeEarned), [totals.lifetimeEarned])
  const tierProgress = useMemo(
    () => getTierProgress(totals.lifetimeEarned),
    [totals.lifetimeEarned],
  )
  const nextReward = useMemo(() => getNextReward(totals.balance), [totals.balance])
  const history = useMemo(() => sortLedger(entries), [entries])

  /** Points an order would be worth at this member's current tier. */
  const previewPointsForOrder = useCallback(
    (orderTotals) => pointsForOrder(orderTotals, tier.multiplier),
    [tier.multiplier],
  )

  /**
   * Called once an order is placed. Returns the points added so the
   * confirmation screen can celebrate them.
   */
  const earnFromOrder = useCallback(
    async (order) => {
      if (!user || !order) return 0

      const points = pointsForOrder(order.totals, tier.multiplier)
      if (points <= 0) return 0

      try {
        const updated = await loyaltyService.earnPoints(user.id, {
          points,
          reason: `Order ${order.orderNumber}`,
          orderNumber: order.orderNumber,
        })
        setEntries(updated)
        return points
      } catch (caught) {
        // Never block a confirmed order because the points did not post.
        console.error('[loyalty] could not add points for the order', caught)
        return 0
      }
    },
    [user, tier.multiplier],
  )

  const redeem = useCallback(
    async (rewardId) => {
      if (!user) return { error: 'Log in to spend your points.' }

      setRedeemingRewardId(rewardId)
      try {
        const { entries: updated, reward } = await loyaltyService.redeemReward(user.id, rewardId)
        setEntries(updated)
        return { reward }
      } catch (caught) {
        return { error: toDisplayError(caught) }
      } finally {
        setRedeemingRewardId(null)
      }
    },
    [user],
  )

  const value = useMemo(
    () => ({
      isMember: isLoggedIn,
      isLoading,
      error,
      balance: totals.balance,
      lifetimeEarned: totals.lifetimeEarned,
      redeemed: totals.redeemed,
      history,
      tier,
      tierProgress,
      nextReward,
      redeemingRewardId,
      previewPointsForOrder,
      earnFromOrder,
      redeem,
    }),
    [
      isLoggedIn,
      isLoading,
      error,
      totals,
      history,
      tier,
      tierProgress,
      nextReward,
      redeemingRewardId,
      previewPointsForOrder,
      earnFromOrder,
      redeem,
    ],
  )

  return <LoyaltyContext.Provider value={value}>{children}</LoyaltyContext.Provider>
}

export function useLoyalty() {
  const context = useContext(LoyaltyContext)
  if (!context) {
    throw new Error('useLoyalty must be used inside a <LoyaltyProvider>.')
  }
  return context
}
