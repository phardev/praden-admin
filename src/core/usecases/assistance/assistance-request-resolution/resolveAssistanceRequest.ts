import type { AssistanceRequestGateway } from '@core/gateways/assistanceRequestGateway'
import { useAssistanceRequestStore } from '@store/assistanceRequestStore'

export const resolveAssistanceRequest = async (
  id: string,
  gateway: AssistanceRequestGateway
): Promise<void> => {
  const details = await gateway.resolve(id)
  useAssistanceRequestStore().setCurrent(details)
}
