import { type ProductGateway } from '@core/gateways/productGateway'
import { type Product } from '@core/entities/product'
import { useProductStore } from '@store/productStore'
import { CategoryGateway } from '@core/gateways/categoryGateway'
import { LocationGateway } from '@core/gateways/locationGateway'

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
  productGateway: ProductGateway,
  categoryGateway: CategoryGateway,
  locationGateway: LocationGateway
) => {
  await categoryGateway.getByUuid(dto.categoryUuid)
  for (const location of Object.entries(dto.locations)) {
    await locationGateway.getByUuid(location[0])
  }
  const created = await productGateway.create(dto)
  const productStore = useProductStore()
  productStore.add(created)
}
