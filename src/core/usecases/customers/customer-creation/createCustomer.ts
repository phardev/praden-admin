import { CustomerGateway } from '@core/gateways/customerGateway'
import { useCustomerStore } from '@store/customerStore'
import { Customer } from '@core/entities/customer'

export type CreateCustomerDTO = Omit<Customer, 'uuid'>

export const createCustomer = async (
  dto: CreateCustomerDTO,
  customerGateway: CustomerGateway
): Promise<void> => {
  const created = await customerGateway.create(dto)
  const customerStore = useCustomerStore()
  customerStore.add(created)
}
