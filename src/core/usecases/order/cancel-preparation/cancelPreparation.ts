import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'
import { OrderGateway } from '@core/gateways/orderGateway'
import { usePreparationStore } from '@store/preparationStore'

export const cancelPreparation = async (orderGateway: OrderGateway) => {
  const preparationStore = usePreparationStore()
  try {
    preparationStore.startLoading()
    const preparation = preparationStore.current
    if (!preparation) throw new NoPreparationSelectedError()
    const canceled = await orderGateway.cancelPreparation(preparation)
    preparationStore.remove(canceled.uuid)
  } finally {
    preparationStore.stopLoading()
  }
}
