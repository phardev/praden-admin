import { usePreparationStore } from '@store/preparationStore'
import { Order, OrderLine } from '@core/entities/order'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'

export interface GetOrdersToPrepareItemVM {
  reference: string
  client: string
  createdDate: string
  createdDatetime: Date
  total: string
}

export interface Header {
  name: string
  value: string
}

export interface GetOrdersToPrepareVM {
  headers: Array<Header>
  items: Array<GetOrdersToPrepareItemVM>
}

const computeTotalWithTaxForOrder = (order: Order) => {
  const total = order.lines.reduce((acc: number, line: OrderLine) => {
    return (
      acc +
      line.unitAmount * line.expectedQuantity +
      (line.unitAmount * line.expectedQuantity * line.percentTaxRate) / 100
    )
  }, 0)
  return total
}

export const getOrdersToPrepareVM = (): GetOrdersToPrepareVM => {
  const preparationStore = usePreparationStore()
  const orders = preparationStore.items
  const formatter = priceFormatter('fr-FR', 'EUR')
  return {
    headers: [
      {
        name: 'Référence',
        value: 'reference'
      },
      {
        name: 'Client',
        value: 'client'
      },
      {
        name: 'Date',
        value: 'createdDate'
      },
      {
        name: 'Total TTC',
        value: 'total'
      }
    ],
    items: orders.map((o: Order) => {
      const total = computeTotalWithTaxForOrder(o)
      return {
        reference: o.uuid,
        client: `${o.deliveryAddress.firstname[0]}. ${o.deliveryAddress.lastname}`,
        createdDate: timestampToLocaleString(o.createdAt, 'fr-FR'),
        createdDatetime: new Date(o.createdAt),
        total: formatter.format(total / 100)
      }
    })
  }
}
