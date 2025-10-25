import { CategoryGateway } from '@core/gateways/categoryGateway'
import { useCategoryStore } from '@store/categoryStore'

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
