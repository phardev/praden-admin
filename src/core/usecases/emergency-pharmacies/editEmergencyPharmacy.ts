import { EmergencyPharmacyGateway } from '@core/gateways/emergencyPharmacyGateway'
import { useEmergencyPharmacyStore } from '@store/emergencyPharmacyStore'
import { UUID, Timestamp } from '@core/types/types'

export interface EditEmergencyPharmacyDTO {
  name?: string
  address?: string
  phone?: string
  date?: Timestamp
  isActive?: boolean
}

export const editEmergencyPharmacy = async (
  uuid: UUID,
  dto: EditEmergencyPharmacyDTO,
  emergencyPharmacyGateway: EmergencyPharmacyGateway
): Promise<void> => {
  const pharmacy = await emergencyPharmacyGateway.edit(uuid, dto)
  const emergencyPharmacyStore = useEmergencyPharmacyStore()
  emergencyPharmacyStore.update(pharmacy)
}
