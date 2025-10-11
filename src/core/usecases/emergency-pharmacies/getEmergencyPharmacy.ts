import { EmergencyPharmacyGateway } from '@core/gateways/emergencyPharmacyGateway'
import { useEmergencyPharmacyStore } from '@store/emergencyPharmacyStore'
import { UUID } from '@core/types/types'

export const getEmergencyPharmacy = async (
  uuid: UUID,
  emergencyPharmacyGateway: EmergencyPharmacyGateway
): Promise<void> => {
  const pharmacy = await emergencyPharmacyGateway.get(uuid)
  const emergencyPharmacyStore = useEmergencyPharmacyStore()
  emergencyPharmacyStore.setCurrent(pharmacy)
}
