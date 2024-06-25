import { Category } from '@core/entities/category'
import { CategoryGateway } from '@core/gateways/categoryGateway'
import { useCategoryStore } from '@store/categoryStore'
import { UUID } from '@core/types/types'
import { useProductStore } from '@store/productStore'
import { ProductGateway } from '@core/gateways/productGateway'

export type CreateCategoryDTO = Omit<Category, 'uuid'> & {
  productsAdded: Array<UUID>
}

export const createCategory = async (
  dto: CreateCategoryDTO,
  categoryGateway: CategoryGateway,
  productGateway: ProductGateway
): Promise<void> => {
  const created = await categoryGateway.create(dto)
  const categoryStore = useCategoryStore()
  categoryStore.add(created)
  const productStore = useProductStore()
  for (const productUuid of dto.productsAdded) {
    const editedProduct = await productGateway.edit(productUuid, {
      categoryUuid: created.uuid
    })
    productStore.edit(editedProduct)
  }
}
