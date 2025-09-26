import { SystemResourceGateway } from '@core/gateways/systemResourceGateway'
import { useSystemResourceStore } from '@store/systemResourceStore'

export const listSystemResources = async (
  systemResourceGateway: SystemResourceGateway
) => {
  const systemResourceStore = useSystemResourceStore()
  try {
    systemResourceStore.startLoading()
    const systemResources = await systemResourceGateway.list()
    systemResourceStore.list(systemResources)
  } finally {
    systemResourceStore.stopLoading()
  }
}
