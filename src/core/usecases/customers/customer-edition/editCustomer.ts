import { CreateCustomerDTO } from '@core/usecases/customers/customer-creation/createCustomer'
import { UUID } from '@core/types/types'
import { CustomerGateway } from '@core/gateways/customerGateway'
import { useCustomerStore } from '@store/customerStore'

export type EditCustomerDTO = Partial<CreateCustomerDTO>

export const editCustomer = async (
  uuid: UUID,
  dto: EditCustomerDTO,
  customerGateway: CustomerGateway
): Promise<void> => {
  const edited = await customerGateway.edit(uuid, dto)
  const customerStore = useCustomerStore()
  customerStore.edit(edited)
}
