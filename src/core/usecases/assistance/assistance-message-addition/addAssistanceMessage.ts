import type { AssistanceRequestGateway } from '@core/gateways/assistanceRequestGateway'
import { useAssistanceRequestStore } from '@store/assistanceRequestStore'

export const addAssistanceMessage = async (
  id: string,
  content: string,
  attachments: Array<File>,
  gateway: AssistanceRequestGateway
): Promise<void> => {
  const details = await gateway.addMessage(id, content, attachments)
  useAssistanceRequestStore().setCurrent(details)
}
