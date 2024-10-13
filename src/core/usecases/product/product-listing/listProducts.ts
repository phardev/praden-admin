import { ProductGateway } from '@core/gateways/productGateway'
import { useProductStore } from '@store/productStore'

export const listProducts = async (
  limit: number,
  offset: number,
  productGateway: ProductGateway
) => {
  const products = await productGateway.list(limit, offset)
  const productStore = useProductStore()
  productStore.list(products)
}
