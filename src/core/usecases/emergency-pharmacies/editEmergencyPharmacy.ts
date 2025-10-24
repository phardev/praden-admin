import { EmergencyPharmacyGateway } from '@core/gateways/emergencyPharmacyGateway'
import { Timestamp, UUID } from '@core/types/types'
import { useEmergencyPharmacyStore } from '@store/emergencyPharmacyStore'

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
