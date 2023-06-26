import { OrderGateway } from '@core/gateways/orderGateway'
import { usePreparationStore } from '@store/preparationStore'
import { NoPreparationSelectedError } from '@core/errors/noPreparationSelectedError'

export const askClientHowToFinishPreparation = async (
  orderGateway: OrderGateway
) => {
  const preparationStore = usePreparationStore()
  const currentPreparation = preparationStore.current
  if (!currentPreparation) throw new NoPreparationSelectedError()
  const preparation = await orderGateway.askHowToFinish(
    JSON.parse(JSON.stringify(currentPreparation))
  )
  preparationStore.update(preparation)
  preparationStore.setCurrent(preparation)
}
