import { useTicketStore } from '@store/ticketStore'
import {
  TicketMessage,
  TicketMessageAttachment,
  TicketStatus,
  TicketPriority,
  TicketMessageType
} from '@core/entities/ticket'
import { Timestamp, UUID } from '@core/types/types'

export interface TicketMessageVM {
  uuid: UUID
  content: string
  type: TicketMessageType
  sentAt: Timestamp
  authorName: string
  attachments: Array<TicketMessageAttachment>
}

export interface TicketCustomerVM {
  uuid: UUID
  email: string
  name: string
}

export interface TicketDetailsVM {
  uuid: UUID
  ticketNumber: string
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  customer: TicketCustomerVM
  messages: Array<TicketMessageVM>
  createdAt: Timestamp
  updatedAt: Timestamp
  orderUuid?: UUID
}

export interface GetTicketDetailsVM {
  item: TicketDetailsVM | undefined
  isLoading: boolean
}

const mapMessageToVM = (message: TicketMessage): TicketMessageVM => ({
  uuid: message.uuid,
  content: message.content,
  type: message.type,
  sentAt: message.sentAt,
  authorName: message.authorName,
  attachments: message.attachments
})

export const getTicketDetailsVM = (): GetTicketDetailsVM => {
  const ticketStore = useTicketStore()
  const currentTicket = ticketStore.currentTicket

  if (!currentTicket) {
    return {
      item: undefined,
      isLoading: ticketStore.isLoading
    }
  }

  return {
    item: {
      uuid: currentTicket.uuid,
      ticketNumber: currentTicket.ticketNumber,
      subject: currentTicket.subject,
      description: currentTicket.description,
      status: currentTicket.status,
      priority: currentTicket.priority,
      customer: {
        uuid: currentTicket.customer.uuid,
        email: currentTicket.customer.email,
        name: `${currentTicket.customer.firstname} ${currentTicket.customer.lastname}`
      },
      messages: currentTicket.messages.map(mapMessageToVM),
      createdAt: currentTicket.createdAt,
      updatedAt: currentTicket.updatedAt,
      orderUuid: currentTicket.orderUuid
    },
    isLoading: ticketStore.isLoading
  }
}
