import { EmergencyPharmacy } from '@core/entities/emergencyPharmacy'
import { useEmergencyPharmacyStore } from '@store/emergencyPharmacyStore'

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
