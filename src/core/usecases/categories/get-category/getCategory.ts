import { UUID } from '@core/types/types'
import { CategoryGateway } from '@core/gateways/categoryGateway'
import { useCategoryStore } from '@store/categoryStore'
import { ProductGateway } from '@core/gateways/productGateway'

export const getCategory = async (
  uuid: UUID,
  categoryGateway: CategoryGateway,
  productGateway: ProductGateway
) => {
  const category = await categoryGateway.getByUuid(uuid)
  const categoryStore = useCategoryStore()
  const products = await productGateway.getByCategoryUuid(uuid)
  categoryStore.setCurrent({ category, products })
}
