import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'
import { ProductGateway } from '@core/gateways/productGateway'
import { UUID } from '@core/types/types'
import { useProductStore } from '@store/productStore'

export type EditProductDTO = Partial<
  Omit<CreateProductDTO, 'images'> & {
    images: Array<string>
    newImages: Array<File>
    removedImages: Array<string>
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
