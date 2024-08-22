import { type ProductGateway } from '@core/gateways/productGateway'
import { type Product } from '@core/entities/product'
import { useProductStore } from '@store/productStore'
import { CategoryGateway } from '@core/gateways/categoryGateway'
import { LocationGateway } from '@core/gateways/locationGateway'

export type CreateProductDTO = Omit<
  Product,
  'uuid' | 'miniature' | 'isMedicine'
> & {
  newImages: Array<File>
}

export const createProduct = async (
  dto: CreateProductDTO,
  productGateway: ProductGateway,
  categoryGateway: CategoryGateway,
  locationGateway: LocationGateway
) => {
  if (dto.categoryUuid) {
    await categoryGateway.getByUuid(dto.categoryUuid)
  }
  for (const location of Object.entries(dto.locations)) {
    await locationGateway.getByUuid(location[0])
  }
  const created = await productGateway.create(dto)
  const productStore = useProductStore()
  productStore.add(created)
}
