import { useCategoryStore } from '@store/categoryStore'
import { CategoryGateway } from '@core/gateways/categoryGateway'

export const listCategories = async (categoryGateway: CategoryGateway) => {
  const categoryStore = useCategoryStore()

  if (categoryStore.isLoading) {
    return
  }

  try {
    categoryStore.startLoading()
    const categories = await categoryGateway.list()
    categoryStore.list(categories)
  } finally {
    categoryStore.stopLoading()
  }
}
