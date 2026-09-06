/**
 * Payment options shown at checkout.
 *
 * DEMO NOTE: none of these take real money. Nothing is charged, no card
 * details are collected, and no payment provider is contacted. When you add a
 * real gateway, keep these ids and send them to your backend.
 */
export const paymentMethods = [
  {
    id: 'cash',
    label: 'Cash on delivery',
    description: 'Pay the driver or the cashier when your order arrives.',
    icon: 'cash',
  },
  {
    id: 'card-on-delivery',
    label: 'Card on delivery',
    description: 'Our driver brings a card machine to your door.',
    icon: 'card',
  },
  {
    id: 'online',
    label: 'Pay online',
    description: 'Demo only — no payment is taken and no card details are asked for.',
    icon: 'wallet',
  },
]

export function getPaymentMethod(methodId) {
  return paymentMethods.find((method) => method.id === methodId)
}
