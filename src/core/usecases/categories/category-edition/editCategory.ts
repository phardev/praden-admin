import { CategoryGateway } from '@core/gateways/categoryGateway'
import { UUID } from '@core/types/types'
import { CreateCategoryDTO } from '@core/usecases/categories/category-creation/createCategory'
import { useCategoryStore } from '@store/categoryStore'
import { ProductGateway } from '@core/gateways/productGateway'
import { useProductStore } from '@store/productStore'

export type EditCategoryDTO = Omit<CreateCategoryDTO, 'image' | 'miniature'> & {
  productsRemoved: Array<UUID>
  image?: string
  miniature?: string
  newImage?: File
  newMiniature?: File
}

export const editCategory = async (
  uuid: UUID,
  dto: EditCategoryDTO,
  categoryGateway: CategoryGateway,
  productGateway: ProductGateway
): Promise<void> => {
  const edited = await categoryGateway.edit(uuid, dto)
  const categoryStore = useCategoryStore()
  categoryStore.edit(edited)
  const productStore = useProductStore()
  if (dto.productsAdded) {
    const products = await productGateway.addProductsToCategory(
      edited,
      dto.productsAdded
    )
    productStore.list(products)
  }
  if (dto.productsRemoved) {
    const products = await productGateway.removeProductsFromCategory(
      edited,
      dto.productsRemoved
    )
    productStore.list(products)
  }
  return Promise.resolve()
}
