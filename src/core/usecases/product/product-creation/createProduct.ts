import { type ProductGateway } from '@core/gateways/productGateway'
import { type Product } from '@core/entities/product'
import { useProductStore } from '@store/productStore'
import { LocationGateway } from '@core/gateways/locationGateway'
import { UUID } from '@core/types/types'

export type CreateProductDTO = Omit<
  Product,
  'uuid' | 'isMedicine' | 'category' | 'images' | 'miniature'
> & {
  categoryUuid?: UUID
  images?: Array<File>
  miniature?: File
}

export const createProduct = async (
  dto: CreateProductDTO,
  productGateway: ProductGateway,
  locationGateway: LocationGateway
) => {
  for (const location of Object.entries(dto.locations)) {
    await locationGateway.getByUuid(location[0])
  }
  const created = await productGateway.create(dto)
  const productStore = useProductStore()
  productStore.add(created)
}
