import { EmergencyPharmacyGateway } from '@core/gateways/emergencyPharmacyGateway'
import { useEmergencyPharmacyStore } from '@store/emergencyPharmacyStore'
import { UUID } from '@core/types/types'

export const deleteEmergencyPharmacy = async (
  uuid: UUID,
  emergencyPharmacyGateway: EmergencyPharmacyGateway
): Promise<void> => {
  await emergencyPharmacyGateway.delete(uuid)
  const emergencyPharmacyStore = useEmergencyPharmacyStore()
  emergencyPharmacyStore.remove(uuid)
}
