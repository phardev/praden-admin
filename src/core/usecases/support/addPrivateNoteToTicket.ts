import { TicketGateway } from '@core/gateways/ticketGateway'
import { UUID } from '@core/types/types'
import { useTicketStore } from '@store/ticketStore'

export const addPrivateNoteToTicket = async (
  ticketUuid: UUID,
  content: string,
  authorUuid: UUID,
  ticketGateway: TicketGateway,
  attachments: Array<File> = []
): Promise<void> => {
  const updatedTicket = await ticketGateway.addPrivateNote(
    ticketUuid,
    content,
    authorUuid,
    attachments
  )
  const ticketStore = useTicketStore()
  ticketStore.updateTicket(updatedTicket)

  return Promise.resolve()
}
