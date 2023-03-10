import { OrderGateway } from '@core/gateways/orderGateway'
import { usePreparationStore } from '@store/preparationStore'
import { MessageContent } from '@core/entities/order'
import { NoPreparationSelectedError } from '@core/errors/noPreparationSelectedError'
import { MessageGateway } from '@core/gateways/messageGateway'

export const askClientHowToFinishPreparation = async (
  orderGateway: OrderGateway,
  messageGateway: MessageGateway
) => {
  const preparationStore = usePreparationStore()
  const currentPreparation = preparationStore.current
  if (!currentPreparation) throw new NoPreparationSelectedError()
  const message = await messageGateway.create(MessageContent.AskToClient)
  const preparation = await orderGateway.addMessage(
    JSON.parse(JSON.stringify(currentPreparation)),
    message
  )
  preparationStore.update(preparation)
  preparationStore.setCurrent(preparation)
}
