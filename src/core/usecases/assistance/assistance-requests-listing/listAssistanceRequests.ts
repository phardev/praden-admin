import type { AssistanceRequestGateway } from '@core/gateways/assistanceRequestGateway'
import { useAssistanceRequestStore } from '@store/assistanceRequestStore'

export const listAssistanceRequests = async (
  gateway: AssistanceRequestGateway
): Promise<void> => {
  const store = useAssistanceRequestStore()
  try {
    store.startLoading()
    const items = await gateway.list()
    store.setItems(items)
  } finally {
    store.stopLoading()
  }
}
