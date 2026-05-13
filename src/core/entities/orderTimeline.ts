import type { Timestamp } from '@core/types/types'

export enum TimelineEntryType {
  Placed = 'PLACED',
  Paid = 'PAID',
  PaymentRejected = 'PAYMENT_REJECTED',
  PreparationStarted = 'PREPARATION_STARTED',
  PreparationSaved = 'PREPARATION_SAVED',
  PreparationValidated = 'PREPARATION_VALIDATED',
  PreparationCanceled = 'PREPARATION_CANCELED',
  Shipped = 'SHIPPED',
  Delivered = 'DELIVERED'
}

export type TimelineActor =
  | { kind: 'staff'; email: string; firstname?: string; lastname?: string }
  | { kind: 'system' }
  | { kind: 'unknown' }

export interface TimelineEntry {
  type: TimelineEntryType
  createdAt: Timestamp
  actor: TimelineActor
}
