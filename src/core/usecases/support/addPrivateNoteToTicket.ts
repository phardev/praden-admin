import { TicketGateway } from '@core/gateways/ticketGateway'
import { UUID } from '@core/types/types'
import { useTicketStore } from '@store/ticketStore'

export const addPrivateNoteToTicket = async (
  ticketUuid: UUID,
  content: string,
  authorName: string,
  ticketGateway: TicketGateway,
  attachments: Array<File> = []
): Promise<void> => {
  const updatedTicket = await ticketGateway.addPrivateNote(
    ticketUuid,
    content,
    authorName,
    attachments
  )
  const ticketStore = useTicketStore()
  ticketStore.updateTicket(updatedTicket)

  return Promise.resolve()
}
