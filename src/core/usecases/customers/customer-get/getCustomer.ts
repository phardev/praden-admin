import { UUID } from '@core/types/types'
import { useCustomerStore } from '@store/customerStore'
import { CustomerGateway } from '../../../gateways/customerGateway'

export const getCustomer = async (
  uuid: UUID,
  customerGateway: CustomerGateway
) => {
  const customer = await customerGateway.getByUuid(uuid)
  const customerStore = useCustomerStore()
  customerStore.setCurrent(customer)
}
