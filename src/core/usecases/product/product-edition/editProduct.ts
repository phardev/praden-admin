import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'
import { ProductGateway } from '@core/gateways/productGateway'
import { UUID } from '@core/types/types'
import { CategoryGateway } from '@core/gateways/categoryGateway'
import { useProductStore } from '@store/productStore'

export type EditProductDTO = Partial<CreateProductDTO>

const formatDto = (dto: EditProductDTO): EditProductDTO => {
  const res = JSON.parse(JSON.stringify(dto))
  if (dto.priceWithoutTax) {
    res.priceWithoutTax = parseFloat(dto.priceWithoutTax) * 100
  }
  return res
}

export const editProduct = async (
  uuid: UUID,
  dto: EditProductDTO,
  productGateway: ProductGateway,
  categoryGateway: CategoryGateway
): Promise<void> => {
  if (dto.categoryUuid) await categoryGateway.getByUuid(dto.categoryUuid)
  const formattedDto = formatDto(dto)
  const edited = await productGateway.edit(uuid, formattedDto)
  const productStore = useProductStore()
  productStore.edit(edited)
}
