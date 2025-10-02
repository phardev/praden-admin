import { StaffGateway } from '@core/gateways/staffGateway'
import { useStaffStore } from '@store/staffStore'
import { UUID } from '@core/types/types'

export const assignRoleToStaff = async (
  staffUuid: UUID,
  roleUuid: UUID,
  staffGateway: StaffGateway
): Promise<void> => {
  const updatedStaff = await staffGateway.assignRole(staffUuid, roleUuid)
  const staffStore = useStaffStore()
  staffStore.update(updatedStaff)

  if (staffStore.current && staffStore.current.uuid === staffUuid) {
    staffStore.setCurrent(updatedStaff)
  }

  return Promise.resolve()
}
