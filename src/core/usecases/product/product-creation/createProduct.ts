import { type ProductGateway } from '@core/gateways/productGateway'
import { type Product } from '@core/entities/product'
import { useProductStore } from '@store/productStore'
import { LocationGateway } from '@core/gateways/locationGateway'
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
  productGateway: ProductGateway,
  locationGateway: LocationGateway
) => {
  const productStore = useProductStore()
  productStore.startLoading()
  for (const location of Object.entries(dto.locations)) {
    await locationGateway.getByUuid(location[0])
  }
  const created = await productGateway.create(dto)
  productStore.add(created)
  productStore.stopLoading()
}
