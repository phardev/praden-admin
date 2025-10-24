import { LaboratoryGateway } from '@core/gateways/laboratoryGateway'
import { ProductGateway } from '@core/gateways/productGateway'
import { UUID } from '@core/types/types'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { useProductStore } from '@store/productStore'
import { Laboratory } from '../../../entities/laboratory'

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
  try {
    laboratoryStore.startLoading()
    const created = await laboratoryGateway.create(dto)
    laboratoryStore.add(created)
    const productStore = useProductStore()
    if (dto.productsAdded.length) {
      const updatedProducts = await productGateway.bulkEdit(
        { laboratory: created },
        dto.productsAdded
      )
      updatedProducts.forEach((product) => productStore.edit(product))
    }
  } finally {
    laboratoryStore.stopLoading()
  }
}
