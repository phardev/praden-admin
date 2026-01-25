import type { Category, CategoryStatus } from '@core/entities/category'
import type { CategoryGateway } from '@core/gateways/categoryGateway'
import type { ProductGateway } from '@core/gateways/productGateway'
import type { UUID } from '@core/types/types'
import { useCategoryStore } from '@store/categoryStore'
import { useProductStore } from '@store/productStore'

export type CreateCategoryDTO = Omit<
  Category,
  'uuid' | 'image' | 'miniature' | 'order' | 'status'
> & {
  productsAdded: Array<UUID>
  image?: File
  miniature?: File
  status?: CategoryStatus
}

export const createCategory = async (
  dto: CreateCategoryDTO,
  categoryGateway: CategoryGateway,
  productGateway: ProductGateway
): Promise<void> => {
  const categoryStore = useCategoryStore()
  try {
    categoryStore.startLoading()
    const created = await categoryGateway.create(dto)
    categoryStore.add(created)
    const productStore = useProductStore()
    const products = await productGateway.batch(dto.productsAdded)
    for (const product of products) {
      const editedProduct = await productGateway.edit(product.uuid, {
        categoryUuids: [...product.categories.map((c) => c.uuid), created.uuid]
      })
      productStore.edit(editedProduct)
    }
  } finally {
    categoryStore.stopLoading()
  }
}
