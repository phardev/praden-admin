import { ProductGateway } from '@core/gateways/productGateway'
import { UUID } from '@core/types/types'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { LaboratoryGateway } from '../../../gateways/laboratoryGateway'

export const getLaboratory = async (
  uuid: UUID,
  laboratoryGateway: LaboratoryGateway,
  productGateway: ProductGateway
) => {
  const laboratoryStore = useLaboratoryStore()
  try {
    laboratoryStore.startLoading()
    const laboratory = await laboratoryGateway.getByUuid(uuid)
    const products = await productGateway.getByLaboratoryUuid(uuid)
    laboratoryStore.setCurrent({ laboratory, products })
  } finally {
    laboratoryStore.stopLoading()
  }
}
