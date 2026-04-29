import {
  TimelineActor,
  TimelineEntry,
  TimelineEntryType
} from '@core/entities/orderTimeline'
import { useOrderStore } from '@store/orderStore'
import { timestampToLocaleString } from '@utils/formatters'

export type TimelineActorVM =
  | { kind: 'staff'; name: string }
  | { kind: 'system' }
  | { kind: 'unknown' }

export interface TimelineEntryVM {
  type: TimelineEntryType
  labelKey: string
  timestamp: string
  actor: TimelineActorVM
}

export interface GetOrderTimelineVM {
  entries: Array<TimelineEntryVM>
}

const labelKeys: Record<TimelineEntryType, string> = {
  [TimelineEntryType.Placed]: 'orders.timeline.events.placed',
  [TimelineEntryType.Paid]: 'orders.timeline.events.paid',
  [TimelineEntryType.PaymentRejected]: 'orders.timeline.events.paymentRejected',
  [TimelineEntryType.PreparationStarted]:
    'orders.timeline.events.preparationStarted',
  [TimelineEntryType.PreparationSaved]:
    'orders.timeline.events.preparationSaved',
  [TimelineEntryType.PreparationValidated]:
    'orders.timeline.events.preparationValidated',
  [TimelineEntryType.PreparationCanceled]:
    'orders.timeline.events.preparationCanceled',
  [TimelineEntryType.Shipped]: 'orders.timeline.events.shipped',
  [TimelineEntryType.Delivered]: 'orders.timeline.events.delivered'
}

export const getOrderTimelineVM = (): GetOrderTimelineVM => {
  const orderStore = useOrderStore()
  const order = orderStore.current
  if (!order || !order.timeline) {
    return { entries: [] }
  }
  return {
    entries: order.timeline.map(toEntryVM)
  }
}

const toEntryVM = (entry: TimelineEntry): TimelineEntryVM => ({
  type: entry.type,
  labelKey: labelKeys[entry.type],
  timestamp: timestampToLocaleString(entry.createdAt, 'fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }),
  actor: toActorVM(entry.actor)
})

const toActorVM = (actor: TimelineActor): TimelineActorVM => {
  if (actor.kind === 'staff') {
    const fullName = `${actor.firstname ?? ''} ${actor.lastname ?? ''}`.trim()
    return { kind: 'staff', name: fullName || actor.email }
  }
  return actor
}
