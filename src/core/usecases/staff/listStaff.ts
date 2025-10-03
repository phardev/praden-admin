import { StaffGateway } from '@core/gateways/staffGateway'
import { useStaffStore } from '@store/staffStore'

export const listStaff = async (staffGateway: StaffGateway) => {
  const staffStore = useStaffStore()
  try {
    staffStore.startLoading()
    const staff = await staffGateway.list()
    staffStore.list(staff)
  } finally {
    staffStore.stopLoading()
  }
}
