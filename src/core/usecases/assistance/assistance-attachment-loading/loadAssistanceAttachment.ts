import type { AssistanceRequestGateway } from '@core/gateways/assistanceRequestGateway'
import { useAssistanceRequestStore } from '@store/assistanceRequestStore'

export const loadAssistanceAttachment = async (
  id: string,
  attachmentId: string,
  gateway: AssistanceRequestGateway
): Promise<void> => {
  const store = useAssistanceRequestStore()
  if (store.attachmentUrls[attachmentId]) return
  const url = await gateway.downloadAttachment(id, attachmentId)
  store.setAttachmentUrl(attachmentId, url)
}
