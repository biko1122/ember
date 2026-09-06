import { ORDER_TYPES } from '@/data/orderTypes'

/**
 * Order helpers.
 *
 * DEMO NOTE: orders live in localStorage and their status is derived from how
 * long ago they were placed. Nothing is sent to a kitchen. When you connect a
 * real backend, replace `getOrderProgress` with the status the server reports.
 */

export const ORDER_STATUSES = ['received', 'preparing', 'ready', 'completed']

/** Minutes after placement at which each stage becomes current. */
const STAGE_TIMELINE = [
  { status: 'received', afterMinutes: 0 },
  { status: 'preparing', afterMinutes: 3 },
  { status: 'ready', afterMinutes: 18 },
  { status: 'completed', afterMinutes: 40 },
]

const STAGE_LABELS = {
  received: 'Order received',
  preparing: 'Preparing your food',
  ready: {
    [ORDER_TYPES.DELIVERY]: 'Out for delivery',
    [ORDER_TYPES.PICKUP]: 'Ready for collection',
    [ORDER_TYPES.DINE_IN]: 'Coming to your table',
  },
  completed: {
    [ORDER_TYPES.DELIVERY]: 'Delivered',
    [ORDER_TYPES.PICKUP]: 'Collected',
    [ORDER_TYPES.DINE_IN]: 'Served',
  },
}

export function getStageLabel(status, orderType) {
  const label = STAGE_LABELS[status]
  return typeof label === 'string' ? label : label[orderType] ?? label[ORDER_TYPES.DELIVERY]
}

/** Sequential order number, e.g. "EMB-1048". */
export function createOrderNumber(previousOrders = []) {
  const nextSequence = 1048 + previousOrders.length
  return `EMB-${nextSequence}`
}

/**
 * Which stage an order is at now, plus the full timeline for the tracker.
 * Purely time-based — this is a front-end demo, not real kitchen data.
 */
export function getOrderProgress(order, now = Date.now()) {
  const minutesElapsed = (now - new Date(order.placedAt).getTime()) / 60000

  const currentIndex = STAGE_TIMELINE.reduce(
    (reached, stage, index) => (minutesElapsed >= stage.afterMinutes ? index : reached),
    0,
  )

  const stages = STAGE_TIMELINE.map((stage, index) => ({
    status: stage.status,
    label: getStageLabel(stage.status, order.orderType),
    state: index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'upcoming',
  }))

  return {
    status: STAGE_TIMELINE[currentIndex].status,
    statusLabel: getStageLabel(STAGE_TIMELINE[currentIndex].status, order.orderType),
    isComplete: STAGE_TIMELINE[currentIndex].status === 'completed',
    stages,
  }
}

/** "25 Aug 2026, 7:41 PM" */
export function formatOrderDate(isoDate) {
  return new Date(isoDate).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/** Total number of individual products in an order, for "6 items" labels. */
export function countOrderItems(order) {
  return order.lines.reduce((total, line) => total + line.quantity, 0)
}
