import type { AssistanceRequestGateway } from '@core/gateways/assistanceRequestGateway'
import { useAssistanceRequestStore } from '@store/assistanceRequestStore'

export const getAssistanceRequestDetails = async (
  id: string,
  gateway: AssistanceRequestGateway
): Promise<void> => {
  const store = useAssistanceRequestStore()
  try {
    store.startLoadingCurrent()
    const details = await gateway.getById(id)
    store.setCurrent(details)
  } finally {
    store.stopLoadingCurrent()
  }
}
