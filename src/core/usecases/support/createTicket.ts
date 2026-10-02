import { TicketCustomer, TicketPriority } from '@core/entities/ticket'
import { TicketGateway } from '@core/gateways/ticketGateway'
import { UUID } from '@core/types/types'
import { useTicketStore } from '@store/ticketStore'

export interface CreateTicketDTO {
  customer: TicketCustomer
  subject: string
  description: string
  priority: TicketPriority
  orderUuid?: UUID
  attachments: Array<File>
}

export const createTicket = async (
  dto: CreateTicketDTO,
  ticketGateway: TicketGateway
): Promise<void> => {
  const ticketStore = useTicketStore()
  ticketStore.startSaving()
  try {
    const created = await ticketGateway.create(dto)
    ticketStore.updateTicket(created)
    ticketStore.setCurrentTicket(created)
  } finally {
    ticketStore.stopSaving()
  }
}
