import {
  computeTotalWithTaxForOrder,
  GetPreparationsVM,
  Header,
  isStockAvailable
} from '@adapters/primary/view-models/get-orders-to-prepare/getPreparationsVM'
import { usePreparationStore } from '@store/preparationStore'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'
import { MessageContent, Order } from '@core/entities/order'

const waitingClientAnswerFilter = (o: Order) => {
  if (!o.messages.length) return false
  return (
    o.messages[o.messages.length - 1].content === MessageContent.AskToClient
  )
}

const waitingReplenishmentFilter = (o: Order) => {
  if (!o.messages.length) return false
  return (
    o.messages[o.messages.length - 1].content ===
      MessageContent.WaitForRestock && !isStockAvailable(o.lines)
  )
}

export const getWaitingPreparationsVM = (): GetPreparationsVM => {
  const preparationStore = usePreparationStore()
  const orders = preparationStore.items
  const formatter = priceFormatter('fr-FR', 'EUR')
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
  const groups = [
    {
      name: 'En attente de réponse client',
      filter: waitingClientAnswerFilter
    },
    {
      name: 'En attente de réapprovisionnement',
      filter: waitingReplenishmentFilter
    }
  ]
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
      table: {
        headers,
        items
      }
    }
  })
  return res
}
