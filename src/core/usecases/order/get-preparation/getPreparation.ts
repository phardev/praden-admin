import { OrderGateway } from '@core/gateways/orderGateway'
import { UUID } from '@core/types/types'
import { usePreparationStore } from '@store/preparationStore'

export const getPreparation = async (
  uuid: UUID,
  orderGateway: OrderGateway
) => {
  const preparationStore = usePreparationStore()
  try {
    preparationStore.startLoading()
    const preparation = await orderGateway.getByUuid(uuid)
    preparationStore.setCurrent(preparation)
  } finally {
    preparationStore.stopLoading()
  }
}
