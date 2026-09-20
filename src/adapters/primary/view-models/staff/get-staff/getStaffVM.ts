import { Staff } from '@core/entities/staff'
import { UUID } from '@core/types/types'
import { useStaffStore } from '@store/staffStore'
import { getStaffDisplayName } from '@utils/staff'

export interface GetStaffItemVM {
  uuid: UUID
  firstname?: string
  lastname?: string
  email: string
  displayName: string
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
        displayName: getStaffDisplayName(s),
        roleUuid: s.role.uuid,
        roleName: s.role.name
      }
    }),
    isLoading: staffStore.isLoading
  }
}
