import { Order } from '@core/entities/order'
import { Product } from '@core/entities/product'
import { OrderGateway } from '@core/gateways/orderGateway'
import { ProductGateway } from '@core/gateways/productGateway'
import { ProductListItem } from '@core/usecases/product/product-listing/productListItem'
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
    const productListItems = products.map(toProductListItem)
    productStore.list(productListItems, productListItems.length + 1)
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

const toProductListItem = (product: Product): ProductListItem => {
  const listItem: ProductListItem = {
    uuid: product.uuid,
    name: product.name,
    ean13: product.ean13,
    categories: product.categories.map((c) => ({
      uuid: c.uuid,
      name: c.name
    })),
    priceWithoutTax: product.priceWithoutTax,
    percentTaxRate: product.percentTaxRate,
    availableStock: product.availableStock,
    minStockToSell: product.minStockToSell,
    stockManagementMode: product.stockManagementMode,
    status: product.status,
    flags: product.flags,
    miniature: product.miniature,
    isMedicine: product.isMedicine
  }
  if (product.laboratory) {
    listItem.laboratory = {
      uuid: product.laboratory.uuid,
      name: product.laboratory.name
    }
  }
  return listItem
}
