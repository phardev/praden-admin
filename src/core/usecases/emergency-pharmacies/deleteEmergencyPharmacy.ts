import { EmergencyPharmacyGateway } from '@core/gateways/emergencyPharmacyGateway'
import { UUID } from '@core/types/types'
import { useEmergencyPharmacyStore } from '@store/emergencyPharmacyStore'

export const deleteEmergencyPharmacy = async (
  uuid: UUID,
  emergencyPharmacyGateway: EmergencyPharmacyGateway
): Promise<void> => {
  const emergencyPharmacyStore = useEmergencyPharmacyStore()
  try {
    emergencyPharmacyStore.startLoading()
    await emergencyPharmacyGateway.delete(uuid)
    emergencyPharmacyStore.remove(uuid)
    emergencyPharmacyStore.stopLoading()
  } catch (error) {
    emergencyPharmacyStore.setError(
      error instanceof Error ? error.message : 'Unknown error'
    )
    throw error
  }
}
