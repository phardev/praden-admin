import { useCustomerStore } from '@store/customerStore'
import { CustomerGateway } from '@core/gateways/customerGateway'

export const listCustomers = async (
  limit: number,
  offset: number,
  customerGateway: CustomerGateway
): Promise<void> => {
  const customers = await customerGateway.list(limit, offset)
  const customerStore = useCustomerStore()
  customerStore.list(customers)
  return Promise.resolve()
}
