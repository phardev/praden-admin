import { EmergencyPharmacyGateway } from '@core/gateways/emergencyPharmacyGateway'
import { Timestamp } from '@core/types/types'
import { useEmergencyPharmacyStore } from '@store/emergencyPharmacyStore'

export interface CreateEmergencyPharmacyDTO {
  name: string
  address: string
  phone: string
  date: Timestamp
  isActive: boolean
}

export const createEmergencyPharmacy = async (
  dto: CreateEmergencyPharmacyDTO,
  emergencyPharmacyGateway: EmergencyPharmacyGateway
): Promise<void> => {
  const pharmacy = await emergencyPharmacyGateway.create(dto)
  const emergencyPharmacyStore = useEmergencyPharmacyStore()
  emergencyPharmacyStore.add(pharmacy)
}
