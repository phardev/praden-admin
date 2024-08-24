import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'
import { ProductGateway } from '@core/gateways/productGateway'
import { UUID } from '@core/types/types'
import { useProductStore } from '@store/productStore'
import { LocationGateway } from '@core/gateways/locationGateway'

export type EditProductDTO = Partial<CreateProductDTO>

export const editProduct = async (
  uuid: UUID,
  dto: EditProductDTO,
  productGateway: ProductGateway,
  locationGateway: LocationGateway
): Promise<void> => {
  if (dto.locations) {
    for (const location of Object.entries(dto.locations)) {
      await locationGateway.getByUuid(location[0])
    }
  }
  const edited = await productGateway.edit(uuid, dto)
  const productStore = useProductStore()
  productStore.edit(edited)
}
