import {
  TicketCustomer,
  TicketMessage,
  TicketMessageAttachment,
  TicketMessageType,
  TicketPriority,
  TicketStatus
} from '@core/entities/ticket'
import { Timestamp, UUID } from '@core/types/types'
import { useTicketStore } from '@store/ticketStore'

export interface TicketMessageVM {
  uuid: UUID
  content: string
  type: TicketMessageType
  sentAt: Timestamp
  author: TicketMessageAuthorVM
  attachments: Array<TicketMessageAttachment>
}

export interface TicketMessageAuthorVM {
  uuid: UUID
  name: string
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

const mapMessageToVM = (
  message: TicketMessage,
  customer: TicketCustomer,
  customerName: string
): TicketMessageVM => ({
  uuid: message.uuid,
  content: message.content,
  type: message.type,
  sentAt: message.sentAt,
  author: {
    uuid: message.authorUuid,
    name: message.authorUuid === customer.uuid ? customerName : 'Service Client'
  },
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

  const customerName = `${currentTicket.customer.firstname} ${currentTicket.customer.lastname}`

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
        name: customerName
      },
      messages: currentTicket.messages.map((message) =>
        mapMessageToVM(message, currentTicket.customer, customerName)
      ),
      createdAt: currentTicket.createdAt,
      updatedAt: currentTicket.updatedAt,
      orderUuid: currentTicket.orderUuid
    },
    isLoading: ticketStore.isLoading
  }
}
