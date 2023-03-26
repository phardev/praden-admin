import { OrderGateway } from '@core/gateways/orderGateway'
import { usePreparationStore } from '@store/preparationStore'
import { timestampToLocaleString } from '@utils/formatters'
import { EmailMessage } from '@core/entities/emailMessage'
import { EmailGateway } from '@core/gateways/emailGateway'

export const startPreparations = async (
  orderGateway: OrderGateway,
  emailGateway: EmailGateway
) => {
  const preparationStore = usePreparationStore()
  const ordersUuids = preparationStore.selected
  for (const uuid of ordersUuids) {
    const order = await orderGateway.startPreparation(uuid)
    preparationStore.update(order)
    const options: any = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }

    const date = timestampToLocaleString(
      order.lines[0].updatedAt,
      'fr-FR',
      options
    )

    const emailMessage: EmailMessage = {
      to: order.contact.email,
      data: {
        orderUuid: order.uuid,
        date
      }
    }
    await emailGateway.send(emailMessage)
  }
  preparationStore.clearSelection()
}
