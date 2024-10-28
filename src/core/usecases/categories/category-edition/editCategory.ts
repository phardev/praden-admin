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
  console.log('edited: ', edited)
  const categoryStore = useCategoryStore()
  categoryStore.edit(edited)
  const productStore = useProductStore()
  if (dto.productsAdded) {
    console.log('added: ', dto.productsAdded)
    const products = await productGateway.batch(dto.productsAdded)
    for (const product of products) {
      console.log('categoryUuids: ', [
        ...product.categories.map((c) => c.uuid),
        edited.uuid
      ])
      const editedProduct = await productGateway.edit(product.uuid, {
        categoryUuids: [...product.categories.map((c) => c.uuid), edited.uuid]
      })
      productStore.edit(editedProduct)
    }
  }
  if (dto.productsRemoved) {
    const products = await productGateway.batch(dto.productsRemoved)
    for (const product of products) {
      const editedProduct = await productGateway.edit(product.uuid, {
        categoryUuids: product.categories
          .map((c) => c.uuid)
          .filter((uuid) => uuid !== edited.uuid)
      })
      productStore.edit(editedProduct)
    }
  }
  return Promise.resolve()
}
