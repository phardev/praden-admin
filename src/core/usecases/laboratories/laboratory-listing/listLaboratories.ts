import { LaboratoryGateway } from '@core/gateways/laboratoryGateway'
import { useLaboratoryStore } from '@store/laboratoryStore'

export const listLaboratories = async (
  laboratoryGateway: LaboratoryGateway
) => {
  const store = useLaboratoryStore()
  store.startLoading()
  const res = await laboratoryGateway.list()
  store.list(res)
  store.stopLoading()
}
