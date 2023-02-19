import { NoPreparationSelectedError } from '@core/errors/noPreparationSelectedError'
import { usePreparationStore } from '@store/preparationStore'
import { OrderGateway } from '@core/gateways/orderGateway'

export const validatePreparation = async (orderGateway: OrderGateway) => {
  const preparationStore = usePreparationStore()
  const preparation = preparationStore.current
  if (!preparation) throw new NoPreparationSelectedError()
  await orderGateway.validatePreparation(preparation)
  preparationStore.removeCurrent()
}
