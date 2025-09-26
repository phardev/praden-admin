import { useStaffStore } from '@store/staffStore'
import { Staff } from '@core/entities/staff'
import { UUID } from '@core/types/types'

export interface GetStaffItemVM {
  uuid: UUID
  firstname: string
  lastname: string
  email: string
  roleUuid: UUID
  roleName: string
}

export interface GetStaffVM {
  items: Array<GetStaffItemVM>
  isLoading: boolean
}

export const getStaffVM = (): GetStaffVM => {
  const staffStore = useStaffStore()
  const staff = staffStore.items

  return {
    items: staff.map((s: Staff) => {
      return {
        uuid: s.uuid,
        firstname: s.firstname,
        lastname: s.lastname,
        email: s.email,
        roleUuid: s.role.uuid,
        roleName: s.role.name
      }
    }),
    isLoading: staffStore.isLoading
  }
}
