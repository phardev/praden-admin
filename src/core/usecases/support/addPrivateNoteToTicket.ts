import { TicketGateway } from '@core/gateways/TicketGateway'
import {
  TicketMessage,
  TicketMessageType,
  TicketMessageAttachment
} from '@core/entities/ticket'
import { useTicketStore } from '@store/ticketStore'
import { UUID } from '@core/types/types'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { DateProvider } from '@core/gateways/dateProvider'
import { getFileContent } from '@utils/file'

export const addPrivateNoteToTicket = async (
  ticketUuid: UUID,
  content: string,
  authorName: string,
  ticketGateway: TicketGateway,
  uuidGenerator: UuidGenerator,
  dateProvider: DateProvider,
  attachments: Array<File> = []
): Promise<void> => {
  const messageAttachments: Array<TicketMessageAttachment> = []

  for (const file of attachments) {
    const fileContent = await getFileContent(file)
    messageAttachments.push({
      filename: file.name,
      url: fileContent,
      size: file.size,
      mimeType: file.type
    })
  }

  const note: TicketMessage = {
    uuid: uuidGenerator.generate(),
    content,
    type: TicketMessageType.PRIVATE,
    sentAt: dateProvider.now(),
    authorName,
    attachments: messageAttachments
  }

  const updatedTicket = await ticketGateway.addPrivateNote(ticketUuid, note)
  const ticketStore = useTicketStore()
  ticketStore.updateTicket(updatedTicket)

  return Promise.resolve()
}
