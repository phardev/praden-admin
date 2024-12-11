import { UUID } from '@core/types/types'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { ProductGateway } from '@core/gateways/productGateway'
import { LaboratoryGateway } from '../../../gateways/laboratoryGateway'

export const getLaboratory = async (
  uuid: UUID,
  laboratoryGateway: LaboratoryGateway,
  productGateway: ProductGateway
) => {
  const laboratoryStore = useLaboratoryStore()
  laboratoryStore.startLoading()
  const laboratory = await laboratoryGateway.getByUuid(uuid)
  const products = await productGateway.getByLaboratoryUuid(uuid)
  laboratoryStore.setCurrent({ laboratory, products })
  laboratoryStore.stopLoading()
}
