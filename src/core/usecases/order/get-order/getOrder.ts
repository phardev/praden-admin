import { OrderGateway } from '@core/gateways/orderGateway'
import { UUID } from '@core/types/types'
import { useOrderStore } from '@store/orderStore'
import { isAnonymousOrder } from '@core/entities/order'
import { CustomerGateway } from '@core/gateways/customerGateway'
import { useCustomerStore } from '@store/customerStore'

export const getOrder = async (
  uuid: UUID,
  orderGateway: OrderGateway,
  customerGateway: CustomerGateway
): Promise<void> => {
  const order = await orderGateway.getByUuid(uuid)
  const orderStore = useOrderStore()
  orderStore.setCurrent(order)
  if (!isAnonymousOrder(order)) {
    console.log('Cest une commande avec un customer')
    const customer = await customerGateway.getByUuid(order.customerUuid)
    const customerStore = useCustomerStore()
    customerStore.add(customer)
  }
}
