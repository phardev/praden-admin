import { TicketGateway } from '@core/gateways/ticketGateway'
import { UUID } from '@core/types/types'
import { useTicketStore } from '@store/ticketStore'

export const replyToTicket = async (
  ticketUuid: UUID,
  content: string,
  authorUuid: UUID,
  ticketGateway: TicketGateway,
  attachments: Array<File> = []
): Promise<void> => {
  const updatedTicket = await ticketGateway.addReply(
    ticketUuid,
    content,
    authorUuid,
    attachments
  )
  const ticketStore = useTicketStore()
  ticketStore.updateTicket(updatedTicket)

  return Promise.resolve()
}
