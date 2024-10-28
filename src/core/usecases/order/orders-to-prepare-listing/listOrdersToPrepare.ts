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
  const productUuids = getUniqueProductUuids(orders)
  console.log('productUuids: ', productUuids)
  const products = await productGateway.batch(productUuids)
  const productStore = useProductStore()
  productStore.list(products)
  preparationStore.list(orders)
  preparationStore.stopLoading()
}

const getUniqueProductUuids = (orders: Array<Order>): Array<string> => {
  const uuidsSet: Set<string> = new Set()
  orders.forEach((order) => {
    order.lines.forEach((line) => {
      uuidsSet.add(line.productUuid)
    })
  })
  return Array.from(uuidsSet)
}
