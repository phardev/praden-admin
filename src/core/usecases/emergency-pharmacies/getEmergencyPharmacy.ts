import { EmergencyPharmacyGateway } from '@core/gateways/emergencyPharmacyGateway'
import { UUID } from '@core/types/types'
import { useEmergencyPharmacyStore } from '@store/emergencyPharmacyStore'

export const getEmergencyPharmacy = async (
  uuid: UUID,
  emergencyPharmacyGateway: EmergencyPharmacyGateway
): Promise<void> => {
  const pharmacy = await emergencyPharmacyGateway.get(uuid)
  const emergencyPharmacyStore = useEmergencyPharmacyStore()
  emergencyPharmacyStore.setCurrent(pharmacy)
}
