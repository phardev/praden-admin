import {
  filterPreparationsByGroup,
  GetPreparationsVM,
  isStockAvailable
} from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
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
  return filterPreparationsByGroup(groups)
}
