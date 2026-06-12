import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'
import { OrderGateway } from '@core/gateways/orderGateway'
import { usePreparationStore } from '@store/preparationStore'

export const validatePreparation = async (orderGateway: OrderGateway) => {
  const preparationStore = usePreparationStore()
  try {
    preparationStore.startLoading()
    const preparation = preparationStore.current
    if (!preparation) throw new NoPreparationSelectedError()
    if (preparationStore.validatedUuids.includes(preparation.uuid)) return
    const validated = await orderGateway.validatePreparation(preparation)
    preparationStore.markValidated(validated.uuid)
    preparationStore.remove(validated.uuid)
  } finally {
    preparationStore.stopLoading()
  }
}
