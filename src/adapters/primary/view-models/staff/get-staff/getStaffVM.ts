import { Staff } from '@core/entities/staff'
import { UUID } from '@core/types/types'
import { useStaffStore } from '@store/staffStore'

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

const getDisplayName = (staff: Staff): string => {
  if (staff.firstname && staff.lastname) {
    return `${staff.firstname} ${staff.lastname}`
  }
  if (staff.firstname) {
    return staff.firstname
  }
  if (staff.lastname) {
    return staff.lastname
  }
  return staff.email
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
        displayName: getDisplayName(s),
        roleUuid: s.role.uuid,
        roleName: s.role.name
      }
    }),
    isLoading: staffStore.isLoading
  }
}
