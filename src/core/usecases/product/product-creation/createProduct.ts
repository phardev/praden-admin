import { ProductGateway } from '@core/gateways/productGateway'
import { Product } from '@core/entities/product'
import { useProductStore } from '@store/productStore'

export type CreateProductDTO = Product

export const createProduct = async (
  dto: CreateProductDTO,
  productGateway: ProductGateway
) => {
  const created = await productGateway.create(dto)
  const productStore = useProductStore()
  productStore.add(created)
}
