import { usePreparationStore } from '@store/preparationStore'
import { OrderGateway } from '@core/gateways/orderGateway'
import { useProductStore } from '@store/productStore'
import { Order } from '@core/entities/order'
import { ProductGateway } from '@core/gateways/productGateway'

export const listOrdersToPrepare = async (
  orderGateway: OrderGateway,
  productGateway: ProductGateway
) => {
  const preparationStore = usePreparationStore()
  preparationStore.startLoading()
  const orders = await orderGateway.listOrdersToPrepare()
  const productsEan13 = getUniqueProductsEan13(orders)
  const products = await productGateway.batch(productsEan13)
  const productStore = useProductStore()
  productStore.list(products)
  preparationStore.list(orders)
  preparationStore.stopLoading()
}

const getUniqueProductsEan13 = (orders: Array<Order>): Array<string> => {
  const ean13Set: Set<string> = new Set()
  orders.forEach((order) => {
    order.lines.forEach((line) => {
      ean13Set.add(line.ean13)
    })
  })
  return Array.from(ean13Set)
}
