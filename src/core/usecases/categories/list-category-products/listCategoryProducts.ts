import { ProductGateway } from '@core/gateways/productGateway'
import { UUID } from '@core/types/types'
import { useCategoryStore } from '@store/categoryStore'

export const listCategoryProducts = async (
  limit: number,
  offset: number,
  categoryUuid: UUID,
  productGateway: ProductGateway
) => {
  const products = await productGateway.getByCategoryUuid(
    limit,
    offset,
    categoryUuid
  )
  const categoryStore = useCategoryStore()
  categoryStore.addProducts(products)
}
