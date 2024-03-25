import { usePreparationStore } from '@store/preparationStore'
import { OrderGateway } from '@core/gateways/orderGateway'
import { useProductStore } from '@store/productStore'
import { Order } from '@core/entities/order'
import { ProductGateway } from '@core/gateways/productGateway'

export const listOrdersToPrepare = async (
  orderGateway: OrderGateway,
  productGateway: ProductGateway
) => {
  const orders = await orderGateway.listOrdersToPrepare()
  const productsCip13 = getUniqueProductsCip13(orders)
  const products = await productGateway.batch(productsCip13)
  console.log('products: ', products)
  const productStore = useProductStore()
  productStore.list(products)
  const preparationStore = usePreparationStore()
  preparationStore.list(orders)
}

const getUniqueProductsCip13 = (orders: Array<Order>): Array<string> => {
  const cip13Set: Set<string> = new Set()
  orders.forEach((order) => {
    order.lines.forEach((line) => {
      cip13Set.add(line.cip13)
    })
  })
  return Array.from(cip13Set)
}
