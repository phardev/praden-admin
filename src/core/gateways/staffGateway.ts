import { Staff } from '@core/entities/staff'
import { UUID } from '@core/types/types'

export type CreateStaffDTO = Pick<Staff, 'email' | 'firstname' | 'lastname'> & {
  roleUuid: UUID
}

export type EditStaffDTO = Pick<Staff, 'email' | 'firstname' | 'lastname'> & {
  roleUuid: UUID
}

export interface StaffGateway {
  list(): Promise<Array<Staff>>
  create(dto: CreateStaffDTO): Promise<Staff>
  edit(uuid: UUID, dto: EditStaffDTO): Promise<Staff>
  assignRole(staffUuid: UUID, roleUuid: UUID): Promise<Staff>
}
