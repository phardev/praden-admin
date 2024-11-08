import { LaboratoryGateway } from '@core/usecases/laboratories/laboratory-listing/laboratoryGateway'
import { useLaboratoryStore } from '@store/laboratoryStore'

export const listLaboratories = async (
  laboratoryGateway: LaboratoryGateway
) => {
  const res = await laboratoryGateway.list()
  const store = useLaboratoryStore()
  store.list(res)
}
