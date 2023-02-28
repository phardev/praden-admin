import { OrderGateway } from '@core/gateways/orderGateway'
import { usePreparationStore } from '@store/preparationStore'
import { NoPreparationSelectedError } from '@core/errors/noPreparationSelectedError'

export const savePreparation = async (orderGateway: OrderGateway) => {
  const preparationStore = usePreparationStore()
  const preparation = preparationStore.current
  if (!preparation) throw new NoPreparationSelectedError()
  const order = await orderGateway.savePreparation(preparation)
  preparationStore.update(order)
}
