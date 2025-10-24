import { EmergencyPharmacy } from '@core/entities/emergencyPharmacy'
import { UUID } from '@core/types/types'
import { CreateEmergencyPharmacyDTO } from '@core/usecases/emergency-pharmacies/createEmergencyPharmacy'
import { EditEmergencyPharmacyDTO } from '@core/usecases/emergency-pharmacies/editEmergencyPharmacy'

export interface EmergencyPharmacyGateway {
  list(): Promise<Array<EmergencyPharmacy>>
  create(dto: CreateEmergencyPharmacyDTO): Promise<EmergencyPharmacy>
  edit(uuid: UUID, dto: EditEmergencyPharmacyDTO): Promise<EmergencyPharmacy>
  delete(uuid: UUID): Promise<void>
  get(uuid: UUID): Promise<EmergencyPharmacy>
}
