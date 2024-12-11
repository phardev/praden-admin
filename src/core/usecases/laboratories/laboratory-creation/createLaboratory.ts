import { UUID } from '@core/types/types'
import { Laboratory } from '../../../entities/laboratory'
import { LaboratoryGateway } from '@core/gateways/laboratoryGateway'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { ProductGateway } from '@core/gateways/productGateway'
import { useProductStore } from '@store/productStore'

export type CreateLaboratoryDTO = Omit<
  Laboratory,
  'uuid' | 'image' | 'miniature'
> & {
  productsAdded: Array<UUID>
  image?: File
  miniature?: File
}

export const createLaboratory = async (
  dto: CreateLaboratoryDTO,
  laboratoryGateway: LaboratoryGateway,
  productGateway: ProductGateway
) => {
  const laboratoryStore = useLaboratoryStore()
  laboratoryStore.startLoading()
  const created = await laboratoryGateway.create(dto)
  laboratoryStore.add(created)
  const productStore = useProductStore()
  if (dto.productsAdded.length) {
    const products = await productGateway.bulkEdit(
      { laboratory: created },
      dto.productsAdded
    )
    productStore.list(products)
  }
  laboratoryStore.stopLoading()
}
