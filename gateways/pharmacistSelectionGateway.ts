import { InMemoryPharmacistSelectionGateway } from '@adapters/secondary/pharmacist-selection-gateways/inMemoryPharmacistSelectionGateway'
import { RealPharmacistSelectionGateway } from '@adapters/secondary/pharmacist-selection-gateways/realPharmacistSelectionGateway'
import { isLocalEnv } from '@utils/env'
import * as pharmacistSelections from '@utils/testData/pharmacistSelections'

const pharmacistSelectionGateway = new InMemoryPharmacistSelectionGateway()
pharmacistSelectionGateway.feedWith(pharmacistSelections.pharmacistSelection1)

export const usePharmacistSelectionGateway = () => {
  if (isLocalEnv()) {
    return pharmacistSelectionGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealPharmacistSelectionGateway(BACKEND_URL)
}
