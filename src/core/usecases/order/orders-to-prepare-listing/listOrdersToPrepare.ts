import { Order } from '@core/entities/order'
import { OrderGateway } from '@core/gateways/orderGateway'
import { ProductGateway } from '@core/gateways/productGateway'
import { usePreparationStore } from '@store/preparationStore'
import { useProductStore } from '@store/productStore'

export const listOrdersToPrepare = async (
  orderGateway: OrderGateway,
  productGateway: ProductGateway
) => {
  const preparationStore = usePreparationStore()
  try {
    preparationStore.startLoading()
    const orders = await orderGateway.listOrdersToPrepare()
    const productUuids = getUniqueProductUuids(orders)
    const products = await productGateway.batch(productUuids)
    const productStore = useProductStore()
    products.forEach((product) => productStore.add(product))
    preparationStore.list(orders)
  } finally {
    preparationStore.stopLoading()
  }
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
