import { ProductGateway } from '@core/gateways/productGateway'
import { useProductStore } from '@store/productStore'

export const listProducts = async (
  limit: number,
  offset: number,
  productGateway: ProductGateway
) => {
  const productStore = useProductStore()

  if (productStore.isLoading) {
    return
  }

  try {
    productStore.startLoading()
    const products = await productGateway.list(limit, offset)
    productStore.list(products)
  } finally {
    productStore.stopLoading()
  }
}
