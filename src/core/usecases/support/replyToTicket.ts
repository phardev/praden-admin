import { TicketGateway } from '@core/gateways/ticketGateway'
import { useTicketStore } from '@store/ticketStore'
import { UUID } from '@core/types/types'

export const replyToTicket = async (
  ticketUuid: UUID,
  content: string,
  authorName: string,
  ticketGateway: TicketGateway,
  attachments: Array<File> = []
): Promise<void> => {
  const updatedTicket = await ticketGateway.addReply(
    ticketUuid,
    content,
    authorName,
    attachments
  )
  const ticketStore = useTicketStore()
  ticketStore.updateTicket(updatedTicket)

  return Promise.resolve()
}
