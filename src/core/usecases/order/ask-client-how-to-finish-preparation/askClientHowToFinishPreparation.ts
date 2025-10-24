import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'
import { OrderGateway } from '@core/gateways/orderGateway'
import { usePreparationStore } from '@store/preparationStore'

export const askClientHowToFinishPreparation = async (
  orderGateway: OrderGateway
) => {
  const preparationStore = usePreparationStore()
  try {
    preparationStore.startLoading()
    const currentPreparation = preparationStore.current
    if (!currentPreparation) throw new NoPreparationSelectedError()
    const preparation = await orderGateway.askHowToFinish(
      JSON.parse(JSON.stringify(currentPreparation))
    )
    preparationStore.update(preparation)
    preparationStore.setCurrent(preparation)
  } finally {
    preparationStore.stopLoading()
  }
}
