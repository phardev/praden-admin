import { CategoryGateway } from '@core/gateways/categoryGateway'
import { ProductGateway } from '@core/gateways/productGateway'
import { UUID } from '@core/types/types'
import { CreateCategoryDTO } from '@core/usecases/categories/category-creation/createCategory'
import { useCategoryStore } from '@store/categoryStore'
import { useProductStore } from '@store/productStore'

export type EditCategoryDTO = Omit<CreateCategoryDTO, 'image' | 'miniature'> & {
  productsRemoved: Array<UUID>
  image?: string
  miniature?: string
  newImage?: File
  newMiniature?: File
  order?: number
}

export const editCategory = async (
  uuid: UUID,
  dto: EditCategoryDTO,
  categoryGateway: CategoryGateway,
  productGateway: ProductGateway
): Promise<void> => {
  const categoryStore = useCategoryStore()
  try {
    categoryStore.startLoading()
    const edited = await categoryGateway.edit(uuid, dto)
    categoryStore.edit(edited)
    const productStore = useProductStore()
    if (dto.productsAdded) {
      const products = await productGateway.addProductsToCategory(
        edited,
        dto.productsAdded
      )
      products.forEach((product) => productStore.edit(product))
    }
    if (dto.productsRemoved) {
      const products = await productGateway.removeProductsFromCategory(
        edited,
        dto.productsRemoved
      )
      products.forEach((product) => productStore.edit(product))
    }
  } finally {
    categoryStore.stopLoading()
  }
}
