import type { ProductImage } from '@core/entities/productImage'
import { ProductGateway } from '@core/gateways/productGateway'
import { UUID } from '@core/types/types'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'
import { useProductStore } from '@store/productStore'

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
  } finally {
    productStore.stopLoading()
  }
}
