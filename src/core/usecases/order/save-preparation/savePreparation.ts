import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'
import { OrderGateway } from '@core/gateways/orderGateway'
import { usePreparationStore } from '@store/preparationStore'

export const savePreparation = async (orderGateway: OrderGateway) => {
  const preparationStore = usePreparationStore()
  try {
    preparationStore.startLoading()
    const preparation = preparationStore.current
    if (!preparation) throw new NoPreparationSelectedError()
    const order = await orderGateway.savePreparation(preparation)
    preparationStore.update(order)
  } finally {
    preparationStore.stopLoading()
  }
}
