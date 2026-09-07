import type { Timestamp, UUID } from '@core/types/types'

export const AssistanceRequestStatus = {
  RECEIVED: 'RECEIVED',
  IN_PROGRESS: 'IN_PROGRESS',
  WAITING_FOR_YOUR_ANSWER: 'WAITING_FOR_YOUR_ANSWER',
  ON_HOLD: 'ON_HOLD',
  RESOLVED: 'RESOLVED',
  CANCELLED: 'CANCELLED'
} as const
export type AssistanceRequestStatus =
  (typeof AssistanceRequestStatus)[keyof typeof AssistanceRequestStatus]

export const AssistanceRequestCategory = {
  ORDER: 'ORDER',
  PRODUCT: 'PRODUCT',
  DELIVERY: 'DELIVERY',
  CUSTOMER: 'CUSTOMER',
  OTHER: 'OTHER'
} as const
export type AssistanceRequestCategory =
  (typeof AssistanceRequestCategory)[keyof typeof AssistanceRequestCategory]

export const AssistanceSubjectType = {
  ORDER: 'ORDER',
  PRODUCT: 'PRODUCT',
  CUSTOMER: 'CUSTOMER'
} as const
export type AssistanceSubjectType =
  (typeof AssistanceSubjectType)[keyof typeof AssistanceSubjectType]

export const AssistanceMessageSide = {
  PHARMACY: 'PHARMACY',
  PHARDEV: 'PHARDEV'
} as const
export type AssistanceMessageSide =
  (typeof AssistanceMessageSide)[keyof typeof AssistanceMessageSide]

export interface AssistanceSubject {
  type: AssistanceSubjectType
  label: string
  uuid: UUID
  pageUrl: string
}

export interface AssistanceAttachment {
  id: string
  filename: string
  mimeType: string
  size: number
}

export interface AssistanceMessage {
  id: string
  side: AssistanceMessageSide
  author: string
  content: string
  sentAt: Timestamp
  attachments: Array<AssistanceAttachment>
}

export interface AssistanceRequest {
  id: string
  reference: string
  category: AssistanceRequestCategory
  subject?: AssistanceSubject
  title: string
  author: string
  status: AssistanceRequestStatus
  createdAt: Timestamp
  lastActivityAt: Timestamp
}

export interface AssistanceRequestDetails extends AssistanceRequest {
  description: string
  messages: Array<AssistanceMessage>
}
