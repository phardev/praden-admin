import { Category } from '@core/entities/category'
import { CategoryGateway } from '@core/gateways/categoryGateway'
import { useCategoryStore } from '@store/categoryStore'
import { UUID } from '@core/types/types'
import { useProductStore } from '@store/productStore'
import { ProductGateway } from '@core/gateways/productGateway'

export type CreateCategoryDTO = Omit<
  Category,
  'uuid' | 'image' | 'miniature'
> & {
  productsAdded: Array<UUID>
  image?: File
  miniature?: File
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
  const products = await productGateway.batch(dto.productsAdded)
  for (const product of products) {
    const editedProduct = await productGateway.edit(product.uuid, {
      categoryUuids: [...product.categories.map((c) => c.uuid), created.uuid]
    })
    productStore.edit(editedProduct)
  }
}
