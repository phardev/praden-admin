import { useCustomerStore } from '@store/customerStore'
import { CustomerGateway } from '../../../gateways/customerGateway'

export const listCustomers = async (
  customerGateway: CustomerGateway
): Promise<void> => {
  const customers = await customerGateway.list()
  const customerStore = useCustomerStore()
  customerStore.list(customers)
  return Promise.resolve()
}
