import {
  filterPreparationsByGroup,
  GetPreparationsVM,
  getPreparationsVMHeaders,
  isStockAvailable
} from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { MessageContent, Order } from '@core/entities/order'
import { usePreparationStore } from '@store/preparationStore'

export const waitingClientAnswerFilter = (o: Order) => {
  if (!o.messages.length) return false
  return (
    o.messages[o.messages.length - 1].content === MessageContent.AskToClient
  )
}

export const waitingReplenishmentFilter = (o: Order) => {
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
      filter: waitingClientAnswerFilter,
      canSelect: false,
      headers: getPreparationsVMHeaders
    },
    {
      name: 'En attente de réapprovisionnement',
      filter: waitingReplenishmentFilter,
      canSelect: false,
      headers: getPreparationsVMHeaders
    }
  ]
  const preparationStore = usePreparationStore()
  const isLoading = preparationStore.isLoading
  return {
    items: filterPreparationsByGroup(groups),
    isLoading
  }
}
