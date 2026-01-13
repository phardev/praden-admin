import { Customer } from '@core/entities/customer'
import { CustomerGateway } from '@core/gateways/customerGateway'
import { useCustomerStore } from '@store/customerStore'

export type CreateCustomerDTO = Omit<Customer, 'uuid' | 'loyaltyPoints'> & {
  loyaltyPoints?: number
}

export const createCustomer = async (
  dto: CreateCustomerDTO,
  customerGateway: CustomerGateway
): Promise<void> => {
  const created = await customerGateway.create(dto)
  const customerStore = useCustomerStore()
  customerStore.add(created)
}
