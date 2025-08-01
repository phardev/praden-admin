import { Mail, Timestamp, UUID } from '@core/types/types'

export enum TicketStatus {
  NEW = 'NEW',
  STARTED = 'STARTED',
  RESOLVED = 'RESOLVED'
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum TicketMessageType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

export interface TicketMessageAttachment {
  filename: string
  url: string
  size: number
  mimeType: string
}

export interface TicketMessage {
  uuid: UUID
  content: string
  type: TicketMessageType
  sentAt: Timestamp
  authorName: string
  attachments: Array<TicketMessageAttachment>
}

export interface TicketCustomer {
  uuid: UUID
  email: Mail
  firstname: string
  lastname: string
}

export interface Ticket {
  uuid: UUID
  ticketNumber: string
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  customer: TicketCustomer
  messages: Array<TicketMessage>
  createdAt: Timestamp
  updatedAt: Timestamp
  orderUuid?: UUID
}
