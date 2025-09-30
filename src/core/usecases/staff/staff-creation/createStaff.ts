import { StaffGateway, CreateStaffDTO } from '@core/gateways/staffGateway'
import { useStaffStore } from '@store/staffStore'

export const createStaff = async (
  dto: CreateStaffDTO,
  staffGateway: StaffGateway
): Promise<void> => {
  const staffStore = useStaffStore()
  try {
    staffStore.startLoading()
    const created = await staffGateway.create(dto)
    staffStore.add(created)
  } finally {
    staffStore.stopLoading()
  }
}

export type { CreateStaffDTO }
