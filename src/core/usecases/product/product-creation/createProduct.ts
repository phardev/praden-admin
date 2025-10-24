import { type Product } from '@core/entities/product'
import { type ProductGateway } from '@core/gateways/productGateway'
import { UUID } from '@core/types/types'
import { useProductStore } from '@store/productStore'

export type CreateProductDTO = Omit<
  Product,
  'uuid' | 'isMedicine' | 'categories' | 'images' | 'miniature'
> & {
  categoryUuids: Array<UUID>
  images?: Array<File>
  miniature?: File
}

export const createProduct = async (
  dto: CreateProductDTO,
  productGateway: ProductGateway
) => {
  const productStore = useProductStore()
  try {
    productStore.startLoading()
    const created = await productGateway.create(dto)
    productStore.add(created)
  } finally {
    productStore.stopLoading()
  }
}
