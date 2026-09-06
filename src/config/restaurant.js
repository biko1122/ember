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

/** Demo promo codes. A real build would validate these on a server. */
export const promoCodes = [
  { code: 'EMBER10', type: 'percentage', value: 10, description: '10% off your order' },
  { code: 'FREESHIP', type: 'delivery', value: 0, description: 'Free delivery' },
  { code: 'HOT50', type: 'fixed', value: 50, minimumOrder: 300, description: 'EGP 50 off orders over EGP 300' },
]
