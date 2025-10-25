import { EmergencyPharmacyGateway } from '@core/gateways/emergencyPharmacyGateway'
import { useEmergencyPharmacyStore } from '@store/emergencyPharmacyStore'

export const listEmergencyPharmacies = async (
  emergencyPharmacyGateway: EmergencyPharmacyGateway
): Promise<void> => {
  const emergencyPharmacyStore = useEmergencyPharmacyStore()
  try {
    emergencyPharmacyStore.startLoading()
    const pharmacies = await emergencyPharmacyGateway.list()
    emergencyPharmacyStore.list(pharmacies)
    emergencyPharmacyStore.stopLoading()
  } catch (error) {
    emergencyPharmacyStore.setError(
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}
