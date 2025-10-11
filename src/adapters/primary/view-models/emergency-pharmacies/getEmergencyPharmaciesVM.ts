import { useEmergencyPharmacyStore } from '@store/emergencyPharmacyStore'
import { EmergencyPharmacy } from '@core/entities/emergencyPharmacy'

export interface GetEmergencyPharmaciesVM {
  items: Array<EmergencyPharmacy>
  isLoading: boolean
  error: string | null
}

export const getEmergencyPharmaciesVM = (): GetEmergencyPharmaciesVM => {
  const emergencyPharmacyStore = useEmergencyPharmacyStore()
  return {
    items: emergencyPharmacyStore.items,
    isLoading: emergencyPharmacyStore.isLoading,
    error: emergencyPharmacyStore.error
  }
}
