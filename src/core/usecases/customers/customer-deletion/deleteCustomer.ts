import { CustomerGateway } from '@core/gateways/customerGateway'
import { UUID } from '@core/types/types'
import { useCustomerStore } from '@store/customerStore'
import { useSearchStore } from '@store/searchStore'

export const deleteCustomer = async (
  uuid: UUID,
  customerGateway: CustomerGateway
): Promise<void> => {
  await customerGateway.delete(uuid)
  const customerStore = useCustomerStore()
  customerStore.remove(uuid)
  removeFromSearchResults(uuid)
}

const removeFromSearchResults = (uuid: UUID) => {
  const searchStore = useSearchStore()
  Object.keys(searchStore.items).forEach((key) => {
    searchStore.set(
      key,
      searchStore.items[key].filter((item) => item.uuid !== uuid)
    )
  })
}
