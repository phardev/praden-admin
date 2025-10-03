import { StaffGateway, EditStaffDTO } from '@core/gateways/staffGateway'
import { useStaffStore } from '@store/staffStore'
import { UUID } from '@core/types/types'

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
