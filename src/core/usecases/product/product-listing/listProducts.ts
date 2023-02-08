import { ProductGateway } from '../../../gateways/productGateway'
import { useProductStore } from '../../../../store/productStore'

export const listProducts = async (productGateway: ProductGateway) => {
  const products = await productGateway.list()
  const productStore = useProductStore()
  productStore.list(products)
}
