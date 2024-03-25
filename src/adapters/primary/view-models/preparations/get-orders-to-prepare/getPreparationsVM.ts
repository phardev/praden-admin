import { usePreparationStore } from '@store/preparationStore'
import {
  DeliveryStatus,
  DeliveryType,
  MessageContent,
  Order,
  OrderLine
} from '@core/entities/order'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'
import { TableVM } from '@adapters/primary/view-models/invoices/get-invoice/getInvoiceVM'
import { HashTable } from '@core/types/types'
import { useProductStore } from '@store/productStore'

export interface GetPreparationsItemVM {
  reference: string
  href: string
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
  count: number
  canSelect: boolean
  table: TableVM<GetPreparationsItemVM>
}

export type GetPreparationsVM = HashTable<GetPreparationsGroupVM>

export const computeTotalWithTaxForOrder = (order: Order) => {
  const total = order.lines.reduce((acc: number, line: OrderLine) => {
    return (
      acc +
      line.unitAmount * line.expectedQuantity +
      (line.unitAmount * line.expectedQuantity * line.percentTaxRate) / 100
    )
  }, 0)
  return total
}

const clickAndCollectFilter = (o: Order) => {
  return (
    o.delivery.method.type === DeliveryType.ClickAndCollect &&
    o.lines.every((l: OrderLine) => l.deliveryStatus === DeliveryStatus.Created)
  )
}

const deliveryFilter = (o: Order) => {
  return (
    o.delivery.method.type === DeliveryType.Delivery &&
    o.lines.every((l: OrderLine) => l.deliveryStatus === DeliveryStatus.Created)
  )
}

const toContinueFilter = (o: Order) => {
  return (
    o.lines.some((l) => l.deliveryStatus === DeliveryStatus.Processing) &&
    !o.messages.length
  )
}

export const isStockAvailable = (lines: Array<OrderLine>): boolean => {
  const productStore = useProductStore()
  const stock = productStore.stock
  return lines.every(
    (l) => stock[l.cip13] >= l.expectedQuantity - l.preparedQuantity
  )
}

const toCompleteFilter = (o: Order) => {
  if (!o.messages.length) return false
  return (
    o.messages[o.messages.length - 1].content ===
      MessageContent.WaitForRestock && isStockAvailable(o.lines)
  )
}

const toShipFilter = (o: Order) => {
  if (!o.messages.length) return false
  return (
    o.messages[o.messages.length - 1].content === MessageContent.PartialShip
  )
}

const toCancelFilter = (o: Order) => {
  if (!o.messages.length) return false
  return (
    o.messages[o.messages.length - 1].content === MessageContent.CancelOrder
  )
}

export const getPreparationsVMHeaders: Array<Header> = [
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

export const filterPreparationsByGroup = (groups: any): GetPreparationsVM => {
  const preparationStore = usePreparationStore()
  const orders = preparationStore.items
  const headers = getPreparationsVMHeaders
  const formatter = priceFormatter('fr-FR', 'EUR')
  const res: GetPreparationsVM = {}
  groups.forEach((group: any) => {
    const filteredItems = orders.filter(group.filter)
    const items = filteredItems.map((o: Order) => {
      const total = computeTotalWithTaxForOrder(o)
      return {
        reference: o.uuid,
        href: `/preparations/${o.uuid}`,
        client: `${o.deliveryAddress.firstname[0]}. ${o.deliveryAddress.lastname}`,
        createdDate: timestampToLocaleString(o.createdAt, 'fr-FR'),
        createdDatetime: new Date(o.createdAt),
        total: formatter.format(total / 100)
      }
    })
    res[group.name] = {
      count: items.length,
      canSelect: group.canSelect,
      table: {
        headers,
        items
      }
    }
  })
  return res
}

export const getPreparationsVM = (): GetPreparationsVM => {
  const groups = [
    {
      name: 'Click & Collect',
      filter: clickAndCollectFilter,
      canSelect: true
    },
    {
      name: 'Colissimo',
      filter: deliveryFilter,
      canSelect: true
    },
    {
      name: 'À terminer',
      filter: toContinueFilter,
      canSelect: false
    },
    {
      name: 'À completer',
      filter: toCompleteFilter,
      canSelect: false
    },
    {
      name: 'À expedier',
      filter: toShipFilter,
      canSelect: false
    },
    {
      name: 'À annuler',
      filter: toCancelFilter,
      canSelect: false
    }
  ]
  return filterPreparationsByGroup(groups)
}
