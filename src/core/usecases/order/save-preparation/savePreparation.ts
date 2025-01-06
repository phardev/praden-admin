import { OrderGateway } from '@core/gateways/orderGateway'
import { usePreparationStore } from '@store/preparationStore'
import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'

export const savePreparation = async (orderGateway: OrderGateway) => {
  const preparationStore = usePreparationStore()
  preparationStore.startLoading()
  const preparation = preparationStore.current
  if (!preparation) throw new NoPreparationSelectedError()
  const order = await orderGateway.savePreparation(preparation)
  preparationStore.update(order)
  preparationStore.stopLoading()
}
