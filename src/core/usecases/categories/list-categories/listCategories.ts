import { useCategoryStore } from '@store/categoryStore'
import { CategoryGateway } from '@core/gateways/categoryGateway'

export const listCategories = async (categoryGateway: CategoryGateway) => {
  const categoryStore = useCategoryStore()
  const categories = await categoryGateway.list()
  categoryStore.list(categories)
}
