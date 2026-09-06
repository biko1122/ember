/**
 * Everything about the brand lives here.
 * Change the name, tagline, fees or contact details in this one file and the
 * whole site follows — nothing else hard-codes the restaurant identity.
 */
export const restaurant = {
  name: 'EMBER',
  tagline: 'Made Fresh. Served Hot.',
  description:
    'Flame-grilled burgers, crispy chicken and stone-baked pizza, cooked to order and served the way you like it.',
  foundedYear: 2016,

  contact: {
    phone: '19555',
    email: 'hello@embereats.example',
    supportHours: 'Every day, 10:00 AM – 2:00 AM',
  },

  social: [
    { label: 'Instagram', url: 'https://instagram.com' },
    { label: 'Facebook', url: 'https://facebook.com' },
    { label: 'TikTok', url: 'https://tiktok.com' },
  ],
}

/** Currency + order maths. Adjust once, applies to every price on the site. */
export const orderSettings = {
  currency: 'EGP',
  deliveryFee: 25,
  /** Orders above this amount ship free. Set to `null` to always charge. */
  freeDeliveryAbove: 350,
  /** Minimum basket value required to check out on a delivery order. */
  minimumDeliveryOrder: 100,
  taxRate: 0, // Prices below are tax-inclusive in this demo.
  preparationTime: '20–30 minutes',
  deliveryTime: '35–50 minutes',
}

/**
 * Ember Rewards — the loyalty programme.
 *
 * DEMO NOTE: points are worked out in the browser for this prototype. When the
 * backend arrives, the earn rate and the reward catalogue move to the server
 * and this file keeps only what the marketing copy needs. Everything the UI
 * says about the programme is read from here, so changing the earn rate here
 * changes it on the rewards page, the account page and the order confirmation
 * at once — it is never written down twice.
 */
export const loyaltySettings = {
  programName: 'Ember Rewards',

  /** Points earned per EGP spent. The one number that sets the whole economy. */
  pointsPerEgp: 1,

  /** Dropped into a new member's balance the moment they join. */
  joiningBonus: 250,

  /** What a point is worth when redeemed, in EGP. 100 points = EGP 10. */
  egpPerPoint: 0.1,

  /** Points are earned on the food, not on delivery or the discount. */
  earnsOnDeliveryFee: false,

  /** Months a point stays alive. Shown to customers; not enforced in the demo. */
  expiryMonths: 12,

  /**
   * Tiers, lowest first. `threshold` is the lifetime points needed to reach it.
   * `multiplier` scales everything earned while the member sits in that tier.
   */
  tiers: [
    { id: 'spark', name: 'Spark', threshold: 0, multiplier: 1, perk: 'Earn 1 point per EGP' },
    { id: 'flame', name: 'Flame', threshold: 2000, multiplier: 1.25, perk: '25% bonus points + free delivery Tuesdays' },
    { id: 'blaze', name: 'Blaze', threshold: 6000, multiplier: 1.5, perk: '50% bonus points + a free side every month' },
    { id: 'inferno', name: 'Inferno', threshold: 15000, multiplier: 2, perk: 'Double points, priority kitchen and a birthday feast' },
  ],
}

/** Demo promo codes. A real build would validate these on a server. */
export const promoCodes = [
  { code: 'EMBER10', type: 'percentage', value: 10, description: '10% off your order' },
  { code: 'FREESHIP', type: 'delivery', value: 0, description: 'Free delivery' },
  { code: 'HOT50', type: 'fixed', value: 50, minimumOrder: 300, description: 'EGP 50 off orders over EGP 300' },
]
