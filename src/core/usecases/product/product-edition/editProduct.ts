import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'
import { ProductGateway } from '@core/gateways/productGateway'
import { UUID } from '@core/types/types'
import { useProductStore } from '@store/productStore'

export type EditProductDTO = Partial<
  Omit<CreateProductDTO, 'images'> & {
    images: Array<string>
    newImages: Array<File>
  }
>

export const editProduct = async (
  uuid: UUID,
  dto: EditProductDTO,
  productGateway: ProductGateway
): Promise<void> => {
  const productStore = useProductStore()
  productStore.startLoading()
  const edited = await productGateway.edit(uuid, dto)
  productStore.edit(edited)
  productStore.stopLoading()
}
