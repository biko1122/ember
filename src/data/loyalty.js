/**
 * Ember Rewards — the reward catalogue, the demo history, and the sums.
 *
 * DEMO NOTE: the ledger below is mock data. It seeds a new account so the
 * rewards screens have something to show during a client demo, and real
 * entries are appended on top of it as orders are placed in the prototype.
 * When the backend lands, `seedLedger` goes away and the ledger is fetched.
 *
 * The rules (earn rate, tiers, bonus) live in config/restaurant.js — this file
 * only spends them.
 */

import { loyaltySettings, orderSettings } from '@/config/restaurant'

/* -- Reward catalogue ------------------------------------------------------ */

/**
 * What points can be exchanged for.
 *
 *   cost     points required
 *   kind     'item' unlocks a product, 'discount' takes money off, 'perk' is
 *            everything else. The checkout will use this when it is wired up.
 */
export const rewards = [
  {
    id: 'free-fries',
    name: 'Ember Fries, on us',
    description: 'A regular portion of our skin-on fries with any order.',
    cost: 400,
    kind: 'item',
    itemId: 'ember-fries',
    icon: 'flame',
  },
  {
    id: 'free-drink',
    name: 'Any regular drink',
    description: 'Cola, iced tea, lemon and mint — your pick, no charge.',
    cost: 300,
    kind: 'item',
    itemId: 'cola',
    icon: 'wallet',
  },
  {
    id: 'free-dessert',
    name: 'Free dessert',
    description: 'Finish with a cookie, a cone or a slice of cheesecake.',
    cost: 600,
    kind: 'item',
    itemId: 'dessert-cookie',
    icon: 'star',
  },
  {
    id: 'fifty-off',
    name: 'EGP 50 off your order',
    description: 'Taken straight off the basket at checkout. No minimum spend.',
    cost: 750,
    kind: 'discount',
    value: 50,
    icon: 'cash',
  },
  {
    id: 'free-delivery',
    name: 'Free delivery',
    description: `We cover the ${orderSettings.deliveryFee} EGP delivery fee on your next order.`,
    cost: 250,
    kind: 'perk',
    icon: 'truck',
  },
  {
    id: 'signature-burger',
    name: 'Any signature burger',
    description: 'The whole burger board is yours — including the double stack.',
    cost: 1200,
    kind: 'item',
    itemId: 'ember-signature-burger',
    icon: 'bag',
  },
  {
    id: 'feast-bucket',
    name: 'Family Feast Bucket',
    description: 'Ten pieces, two sides and a large drink. The big one.',
    cost: 3000,
    kind: 'item',
    itemId: 'family-feast-bucket',
    icon: 'plate',
  },
]

export function getRewardById(rewardId) {
  return rewards.find((reward) => reward.id === rewardId)
}

/* -- How points are earned ------------------------------------------------- */

/** The plain-English rules, rendered on the rewards page and at signup. */
export const earningRules = [
  {
    icon: 'bag',
    title: 'Order anything',
    description: `Every EGP you spend on food earns ${loyaltySettings.pointsPerEgp} point. Points land the moment the order is placed.`,
  },
  {
    icon: 'user',
    title: 'Join the programme',
    description: `A welcome ${loyaltySettings.joiningBonus} points drop into your balance as soon as you create an account.`,
  },
  {
    icon: 'star',
    title: 'Climb the tiers',
    description: 'Spend more over the year and every order starts earning faster — up to double points.',
  },
  {
    icon: 'clock',
    title: 'Use them within a year',
    description: `Points stay in your account for ${loyaltySettings.expiryMonths} months from the day you earn them.`,
  },
]

/**
 * Points an order is worth.
 * Delivery fees and discounts are excluded so the number always matches what
 * the customer actually spent on food.
 */
export function pointsForOrder(totals, multiplier = 1) {
  if (!totals) return 0
  const eligible = loyaltySettings.earnsOnDeliveryFee
    ? totals.total
    : Math.max(0, totals.subtotal - (totals.discount ?? 0))
  return Math.max(0, Math.round(eligible * loyaltySettings.pointsPerEgp * multiplier))
}

/** What a number of points is worth in EGP, for "worth EGP 125" labels. */
export function pointsToCurrency(points) {
  return Math.round(points * loyaltySettings.egpPerPoint)
}

/* -- Tiers ----------------------------------------------------------------- */

/** The tier a member sits in, based on points earned over their lifetime. */
export function getTier(lifetimePoints = 0) {
  return (
    [...loyaltySettings.tiers].reverse().find((tier) => lifetimePoints >= tier.threshold) ??
    loyaltySettings.tiers[0]
  )
}

/** The next tier up, or null when they are already at the top. */
export function getNextTier(lifetimePoints = 0) {
  return loyaltySettings.tiers.find((tier) => lifetimePoints < tier.threshold) ?? null
}

/** Everything the tier progress bar needs, in one object. */
export function getTierProgress(lifetimePoints = 0) {
  const tier = getTier(lifetimePoints)
  const nextTier = getNextTier(lifetimePoints)

  if (!nextTier) {
    return { tier, nextTier: null, percentage: 100, pointsToNextTier: 0 }
  }

  const span = nextTier.threshold - tier.threshold
  const earnedInTier = lifetimePoints - tier.threshold

  return {
    tier,
    nextTier,
    percentage: Math.min(100, Math.max(0, Math.round((earnedInTier / span) * 100))),
    pointsToNextTier: nextTier.threshold - lifetimePoints,
  }
}

/* -- Rewards progress ------------------------------------------------------ */

/** The cheapest reward still out of reach — what the progress bar aims at. */
export function getNextReward(balance = 0) {
  return [...rewards].sort((a, b) => a.cost - b.cost).find((reward) => reward.cost > balance) ?? null
}

/** Rewards the member can claim right now. */
export function getAffordableRewards(balance = 0) {
  return rewards.filter((reward) => reward.cost <= balance)
}

/* -- The ledger ------------------------------------------------------------ */

/**
 * Totals derived from the ledger rather than stored alongside it, so the
 * balance can never drift out of step with the history that explains it.
 */
export function summariseLedger(entries = []) {
  let balance = 0
  let lifetimeEarned = 0
  let redeemed = 0

  for (const entry of entries) {
    balance += entry.points
    if (entry.points > 0) lifetimeEarned += entry.points
    else redeemed += Math.abs(entry.points)
  }

  return { balance, lifetimeEarned, redeemed }
}

/** Newest first, for the history list. */
export function sortLedger(entries = []) {
  return [...entries].sort((a, b) => new Date(b.at) - new Date(a.at))
}

const daysAgo = (days) => new Date(Date.now() - days * 86400000).toISOString()

/**
 * The starting history for a new demo account.
 *
 * DEMO ONLY. It exists so the rewards screens are never empty in front of a
 * client — a real member would start with just the joining bonus. Delete this
 * function when the backend arrives.
 */
export function seedLedger() {
  return [
    {
      id: 'seed-welcome',
      at: daysAgo(96),
      points: loyaltySettings.joiningBonus,
      reason: 'Welcome to Ember Rewards',
      type: 'bonus',
    },
    {
      id: 'seed-order-1',
      at: daysAgo(84),
      points: 486,
      reason: 'Order EMB-1043',
      type: 'earn',
      orderNumber: 'EMB-1043',
    },
    {
      id: 'seed-order-2',
      at: daysAgo(61),
      points: 312,
      reason: 'Order EMB-1044',
      type: 'earn',
      orderNumber: 'EMB-1044',
    },
    {
      id: 'seed-redeem-1',
      at: daysAgo(52),
      points: -300,
      reason: 'Redeemed: Any regular drink',
      type: 'redeem',
    },
    {
      id: 'seed-order-3',
      at: daysAgo(38),
      points: 645,
      reason: 'Order EMB-1045',
      type: 'earn',
      orderNumber: 'EMB-1045',
    },
    {
      id: 'seed-birthday',
      at: daysAgo(24),
      points: 200,
      reason: 'Birthday bonus',
      type: 'bonus',
    },
    {
      id: 'seed-order-4',
      at: daysAgo(11),
      points: 407,
      reason: 'Order EMB-1046',
      type: 'earn',
      orderNumber: 'EMB-1046',
    },
  ]
}
