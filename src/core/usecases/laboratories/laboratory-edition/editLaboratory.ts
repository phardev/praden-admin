import { UUID } from '@core/types/types'
import { CreateLaboratoryDTO } from '@core/usecases/laboratories/laboratory-creation/createLaboratory'
import { LaboratoryGateway } from '@core/gateways/laboratoryGateway'
import { ProductGateway } from '@core/gateways/productGateway'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { useProductStore } from '@store/productStore'

export type EditLaboratoryDTO = Partial<
  Omit<CreateLaboratoryDTO, 'image' | 'miniature'> & {
    productsRemoved: Array<UUID>
    image: string
    miniature: string
    newImage: File
    newMiniature: File
  }
>

export const editLaboratory = async (
  uuid: UUID,
  dto: EditLaboratoryDTO,
  laboratoryGateway: LaboratoryGateway,
  productGateway: ProductGateway
) => {
  const laboratoryStore = useLaboratoryStore()
  try {
    laboratoryStore.startLoading()
    const { productsAdded, productsRemoved, ...laboratoryDto } = dto
    const edited = await laboratoryGateway.edit(uuid, laboratoryDto)
    laboratoryStore.edit(edited)
    const productStore = useProductStore()
    if (productsAdded) {
      const products = await productGateway.bulkEdit(
        { laboratory: edited },
        productsAdded
      )
      productStore.list(products)
    }
    if (productsRemoved) {
      const products = await productGateway.bulkEdit(
        { laboratory: null },
        productsRemoved
      )
      productStore.list(products)
    }
  } finally {
    laboratoryStore.stopLoading()
  }
}
