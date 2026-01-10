import { CustomerGateway } from '@core/gateways/customerGateway'
import { useCustomerStore } from '@store/customerStore'

export const listCustomers = async (
  limit: number,
  offset: number,
  customerGateway: CustomerGateway
): Promise<void> => {
  const customerStore = useCustomerStore()

  if (customerStore.isLoading) {
    return
  }

  try {
    customerStore.startLoading()
    const customers = await customerGateway.list(limit, offset)
    customerStore.list(customers)
  } finally {
    customerStore.stopLoading()
  }
}
