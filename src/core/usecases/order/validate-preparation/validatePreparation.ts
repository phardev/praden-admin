import { NoPreparationSelectedError } from '@core/errors/noPreparationSelectedError'
import { usePreparationStore } from '@store/preparationStore'
import { DeliveryStatus } from '@core/entities/order'
import { OrderGateway } from '@core/gateways/orderGateway'

export const validatePreparation = async (orderGateway: OrderGateway) => {
  const preparationStore = usePreparationStore()
  const preparation = preparationStore.current
  if (!preparation) throw new NoPreparationSelectedError()
  preparation.lines.forEach((line) => {
    line.deliveryStatus = DeliveryStatus.Shipped
  })
  await orderGateway.update(preparation)
  preparationStore.removeCurrent()
}
