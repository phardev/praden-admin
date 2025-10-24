import { isAnonymousOrder } from '@core/entities/order'
import { CustomerGateway } from '@core/gateways/customerGateway'
import { OrderGateway } from '@core/gateways/orderGateway'
import { UUID } from '@core/types/types'
import { useCustomerStore } from '@store/customerStore'
import { useOrderStore } from '@store/orderStore'

export const getOrder = async (
  uuid: UUID,
  orderGateway: OrderGateway,
  customerGateway: CustomerGateway
): Promise<void> => {
  const order = await orderGateway.getByUuid(uuid)
  const orderStore = useOrderStore()
  orderStore.setCurrent(order)
  if (!isAnonymousOrder(order)) {
    const customer = await customerGateway.getByUuid(order.customerUuid)
    const customerStore = useCustomerStore()
    customerStore.add(customer)
  }
}
