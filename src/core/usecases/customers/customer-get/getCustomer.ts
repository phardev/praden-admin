import { UUID } from '@core/types/types'
import { useCustomerStore } from '@store/customerStore'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { CustomerGateway } from '../../../gateways/customerGateway'

export const getCustomer = async (
  uuid: UUID,
  customerGateway: CustomerGateway
) => {
  const customer = await customerGateway.getByUuid(uuid)
  const customerStore = useCustomerStore()
  customerStore.setCurrent(customer)

  if (customer.loyalty) {
    const loyaltyStore = useLoyaltyStore()
    loyaltyStore.setCustomerLoyalty(customer.loyalty)
  }
}
