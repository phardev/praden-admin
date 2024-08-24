import { CategoryGateway } from '@core/gateways/categoryGateway'
import { UUID } from '@core/types/types'
import { CreateCategoryDTO } from '@core/usecases/categories/category-creation/createCategory'
import { useCategoryStore } from '@store/categoryStore'
import { ProductGateway } from '@core/gateways/productGateway'
import { useProductStore } from '@store/productStore'

export type EditCategoryDTO = Omit<CreateCategoryDTO, 'image'> & {
  productsRemoved: Array<UUID>
  image?: string
  newImage?: File
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
  if (dto.productsAdded) {
    const productStore = useProductStore()
    for (const productUuid of dto.productsAdded) {
      const editedProduct = await productGateway.edit(productUuid, {
        categoryUuid: edited.uuid
      })
      productStore.edit(editedProduct)
    }
  }
  if (dto.productsRemoved) {
    const productStore = useProductStore()
    for (const productUuid of dto.productsRemoved) {
      const editedProduct = await productGateway.edit(productUuid, {
        categoryUuid: undefined
      })
      productStore.edit(editedProduct)
    }
  }
  return Promise.resolve()
}
