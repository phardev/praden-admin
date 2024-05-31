import { type ProductGateway } from '@core/gateways/productGateway'
import { type Product } from '@core/entities/product'
import { useProductStore } from '@store/productStore'

export type CreateProductDTO = Omit<
  Product,
  | 'uuid'
  | 'images'
  | 'priceWithoutTax'
  | 'percentTaxRate'
  | 'miniature'
  | 'availableStock'
> & {
  images: Array<File>
  priceWithoutTax: string
  percentTaxRate: string
  availableStock: string
}

export const createProduct = async (
  dto: CreateProductDTO,
  productGateway: ProductGateway
) => {
  const created = await productGateway.create(dto)
  const productStore = useProductStore()
  productStore.add(created)
}
