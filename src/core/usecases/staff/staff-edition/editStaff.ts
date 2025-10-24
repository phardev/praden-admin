import { EditStaffDTO, StaffGateway } from '@core/gateways/staffGateway'
import { UUID } from '@core/types/types'
import { useStaffStore } from '@store/staffStore'

export const editStaff = async (
  uuid: UUID,
  dto: EditStaffDTO,
  staffGateway: StaffGateway
): Promise<void> => {
  const staffStore = useStaffStore()
  try {
    staffStore.startLoading()
    const edited = await staffGateway.edit(uuid, dto)
    staffStore.update(edited)
  } finally {
    staffStore.stopLoading()
  }
}

export type { EditStaffDTO }
