import { Staff } from '@core/entities/staff'
import { UUID } from '@core/types/types'

export interface StaffGateway {
  list(): Promise<Array<Staff>>
  assignRole(staffUuid: UUID, roleUuid: UUID): Promise<Staff>
}
