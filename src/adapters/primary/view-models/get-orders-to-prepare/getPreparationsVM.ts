import { usePreparationStore } from '@store/preparationStore'
import { Order, OrderLine } from '@core/entities/order'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'
import { TableVM } from '@adapters/primary/view-models/get-invoice/getInvoiceVM'

export interface GetPreparationsItemVM {
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

interface GetPreparationsGroupVM {
  title: string
  count: number
  table: TableVM<GetPreparationsItemVM>
}

export interface GetPreparationsVM {
  items: Array<GetPreparationsGroupVM>
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

export const getPreparationsVM = (): GetPreparationsVM => {
  const preparationStore = usePreparationStore()
  const orders = preparationStore.items
  const formatter = priceFormatter('fr-FR', 'EUR')
  const groups = ['Click & Collect', 'Livraisons', 'À terminer']
  const headers: Array<Header> = [
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
  ]
  return {
    items: groups.map((group: string, index) => {
      const items = orders.map((o: Order) => {
        const total = computeTotalWithTaxForOrder(o)
        return {
          reference: o.uuid,
          client: `${o.deliveryAddress.firstname[0]}. ${o.deliveryAddress.lastname}`,
          createdDate: timestampToLocaleString(o.createdAt, 'fr-FR'),
          createdDatetime: new Date(o.createdAt),
          total: formatter.format(total / 100)
        }
      })
      return {
        title: group,
        count: index === 0 ? items.length : 0,
        table: {
          headers,
          items: index === 0 ? items : []
        }
      }
    })
  }
}
