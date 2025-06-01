import { useCategoryStore } from '@store/categoryStore'
import { CategoryGateway } from '@core/gateways/categoryGateway'

export const listCategories = async (categoryGateway: CategoryGateway) => {
  const categoryStore = useCategoryStore()
  try {
    categoryStore.startLoading()
    const categories = await categoryGateway.list()
    categoryStore.list(categories)
  } finally {
    categoryStore.stopLoading()
  }
}
