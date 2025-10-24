import { Role } from '@core/entities/role'
import { Staff } from '@core/entities/staff'
import {
  CreateStaffDTO,
  EditStaffDTO,
  StaffGateway
} from '@core/gateways/staffGateway'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { UUID } from '@core/types/types'

export class InMemoryStaffGateway implements StaffGateway {
  private staff: Array<Staff> = []
  private roles: Array<Role> = []
  private uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
  }

  list(): Promise<Array<Staff>> {
    return JSON.parse(JSON.stringify(this.staff))
  }

  async create(dto: CreateStaffDTO): Promise<Staff> {
    const role = this.roles.find((r) => r.uuid === dto.roleUuid)
    if (!role) {
      throw new Error(`Role with UUID ${dto.roleUuid} not found`)
    }

    const newStaff: Staff = {
      uuid: this.uuidGenerator.generate(),
      email: dto.email,
      firstname: dto.firstname,
      lastname: dto.lastname,
      role
    }
    this.staff.push(newStaff)
    return JSON.parse(JSON.stringify(newStaff))
  }

  async edit(uuid: UUID, dto: EditStaffDTO): Promise<Staff> {
    const staffIndex = this.staff.findIndex((s) => s.uuid === uuid)
    if (staffIndex === -1) {
      throw new Error(`Staff with UUID ${uuid} not found`)
    }

    const role = this.roles.find((r) => r.uuid === dto.roleUuid)
    if (!role) {
      throw new Error(`Role with UUID ${dto.roleUuid} not found`)
    }

    const updatedStaff: Staff = {
      uuid,
      email: dto.email,
      firstname: dto.firstname,
      lastname: dto.lastname,
      role
    }

    this.staff[staffIndex] = updatedStaff
    return JSON.parse(JSON.stringify(updatedStaff))
  }

  async assignRole(staffUuid: UUID, roleUuid: UUID): Promise<Staff> {
    const staffIndex = this.staff.findIndex((s) => s.uuid === staffUuid)
    if (staffIndex === -1) {
      throw new Error(`Staff with UUID ${staffUuid} not found`)
    }

    const role = this.roles.find((r) => r.uuid === roleUuid)
    if (!role) {
      throw new Error(`Role with UUID ${roleUuid} not found`)
    }

    const updatedStaff = {
      ...this.staff[staffIndex],
      role: role
    }

    this.staff[staffIndex] = updatedStaff
    return JSON.parse(JSON.stringify(updatedStaff))
  }

  feedWith(...staff: Array<Staff>) {
    this.staff = staff
  }

  feedWithStaff(...staff: Array<Staff>) {
    this.staff = staff
  }

  feedWithRoles(...roles: Array<Role>) {
    this.roles = roles
  }
}
