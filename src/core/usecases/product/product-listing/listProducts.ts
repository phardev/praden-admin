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

  productStore.startLoading()

  try {
    const products = await productGateway.list(limit, offset)
    productStore.list(products)
  } finally {
    productStore.stopLoading()
  }
}
