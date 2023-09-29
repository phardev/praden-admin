import { OrderGateway } from '@core/gateways/orderGateway'
import { usePreparationStore } from '@store/preparationStore'
import { priceFormatter } from '@utils/formatters'
import { PreparationStartedMessage } from '@core/entities/emailMessage'
import { EmailGateway } from '@core/gateways/emailGateway'
import { Order } from '@core/entities/order'
import { computeTotalWithTaxForOrder } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { useProductStore } from '@store/productStore'

export const startPreparations = async (
  orderGateway: OrderGateway,
  emailGateway: EmailGateway
) => {
  const preparationStore = usePreparationStore()
  const ordersUuids = preparationStore.selected
  for (const uuid of ordersUuids) {
    const order = await orderGateway.startPreparation(uuid)
    preparationStore.update(order)
    await sendStartPreparationEmail(order, emailGateway)
  }
  preparationStore.clearSelection()
}

const sendStartPreparationEmail = async (
  order: Order,
  emailGateway: EmailGateway
) => {
  const productStore = useProductStore()
  const formatter = priceFormatter('fr-FR', 'EUR')
  const { firstname, lastname } = order.deliveryAddress
  const address = `${order.deliveryAddress.address}, ${order.deliveryAddress.zip}, ${order.deliveryAddress.city}`
  const phone = order.contact.phone
  const total = computeTotalWithTaxForOrder(order)
  const emailMessage: PreparationStartedMessage = {
    to: order.contact.email,
    shippingAddress: {
      firstname,
      lastname,
      address,
      phone,
      link: ''
    },
    billingAddress: {
      firstname,
      lastname,
      address,
      phone
    },
    lines: order.lines.map((line) => {
      const unitPriceWithTax =
        line.unitAmount + (line.unitAmount * line.percentTaxRate) / 100
      const img = productStore.items.find((p) => p.cip13 === line.cip13).img
      return {
        img,
        name: line.name,
        unitPrice: formatter.format(unitPriceWithTax / 100),
        quantity: line.expectedQuantity,
        total: formatter.format(
          (unitPriceWithTax * line.expectedQuantity) / 100
        )
      }
    }),
    totals: {
      productPrice: formatter.format(total / 100),
      shippingPrice: 'Gratuit',
      price: formatter.format(total / 100)
    }
  }
  await emailGateway.sendPreparationStartedMessage(emailMessage)
}
