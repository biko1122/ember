/**
 * Ember Rewards service.
 *
 * -------------------------------------------------------------------------
 * PROTOTYPE ONLY. Ledgers are kept in this browser, one per account id, and
 * the sums are done here rather than on a server. Good enough to demonstrate
 * the programme; not the real thing.
 *
 * WHEN THE BACKEND ARRIVES
 * `fetchLedger` becomes a GET, `earnPoints` and `redeemReward` become POSTs,
 * and the server owns the arithmetic. The shapes below stay the same.
 * -------------------------------------------------------------------------
 */

import { readStorage, writeStorage, STORAGE_KEYS } from '@/utils/storage'
import { ApiError, LATENCY, mockRequest } from '@/services/mockApi'
import { getRewardById, seedLedger, summariseLedger } from '@/data/loyalty'

const readAllLedgers = () => readStorage(STORAGE_KEYS.loyalty, {})

function readLedger(userId) {
  const ledgers = readAllLedgers()
  return ledgers[userId] ?? null
}

function writeLedger(userId, entries) {
  writeStorage(STORAGE_KEYS.loyalty, { ...readAllLedgers(), [userId]: entries })
  return entries
}

/**
 * A member's history. First time we see an account we seed it with the demo
 * transactions so the rewards screens are never empty during a presentation.
 */
export function fetchLedger(userId) {
  return mockRequest(
    () => {
      const existing = readLedger(userId)
      if (existing) return existing
      return writeLedger(userId, seedLedger())
    },
    { delay: LATENCY.normal },
  )
}

/** Appends an entry and hands back the whole ledger. */
export function earnPoints(userId, { points, reason, orderNumber = null, type = 'earn' }) {
  return mockRequest(
    () => {
      if (points <= 0) {
        throw new ApiError('There were no points to add to that order.')
      }

      const entries = readLedger(userId) ?? seedLedger()
      return writeLedger(userId, [
        ...entries,
        {
          id: `entry-${Date.now().toString(36)}`,
          at: new Date().toISOString(),
          points,
          reason,
          orderNumber,
          type,
        },
      ])
    },
    { delay: LATENCY.fast },
  )
}

export function redeemReward(userId, rewardId) {
  return mockRequest(
    () => {
      const reward = getRewardById(rewardId)
      if (!reward) {
        throw new ApiError('That reward is no longer available.')
      }

      const entries = readLedger(userId) ?? seedLedger()
      const { balance } = summariseLedger(entries)

      // The balance is recomputed from the history here rather than trusted
      // from the caller — the same rule the server will enforce later.
      if (balance < reward.cost) {
        throw new ApiError(
          `You need ${(reward.cost - balance).toLocaleString()} more points for that reward.`,
          { code: 'insufficient_points' },
        )
      }

      const updated = writeLedger(userId, [
        ...entries,
        {
          id: `entry-${Date.now().toString(36)}`,
          at: new Date().toISOString(),
          points: -reward.cost,
          reason: `Redeemed: ${reward.name}`,
          rewardId: reward.id,
          type: 'redeem',
        },
      ])

      return { entries: updated, reward }
    },
    { delay: LATENCY.slow },
  )
}
