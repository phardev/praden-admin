import { type ProductGateway } from '@core/gateways/productGateway'
import { type Product } from '@core/entities/product'
import { useProductStore } from '@store/productStore'
import { UUID } from '@core/types/types'

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
