import type { Product } from '@core/entities/product'
import type { ProductImage } from '@core/entities/productImage'
import { ProductGateway } from '@core/gateways/productGateway'
import { UUID } from '@core/types/types'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'
import { useProductStore } from '@store/productStore'
import { useSearchStore } from '@store/searchStore'

export type EditProductDTO = Partial<
  Omit<CreateProductDTO, 'images'> & {
    orderedImages: Array<ProductImage>
  }
>

export const editProduct = async (
  uuid: UUID,
  dto: EditProductDTO,
  productGateway: ProductGateway
): Promise<void> => {
  const productStore = useProductStore()
  try {
    productStore.startLoading()
    const edited = await productGateway.edit(uuid, dto)
    productStore.edit(edited)
    updateSearchResults(edited)
  } finally {
    productStore.stopLoading()
  }
}

export const updateSearchResults = (edited: Product) => {
  const searchStore = useSearchStore()
  Object.keys(searchStore.items).forEach((key) => {
    searchStore.set(
      key,
      searchStore.items[key].map((item) =>
        item.uuid === edited.uuid ? edited : item
      )
    )
  })
}
