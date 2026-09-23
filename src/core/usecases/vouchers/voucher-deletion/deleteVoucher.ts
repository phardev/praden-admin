import { VoucherGateway } from '@core/gateways/voucherGateway'
import { UUID } from '@core/types/types'
import { useVoucherStore } from '@store/voucherStore'

export const deleteVoucher = async (
  uuid: UUID,
  voucherGateway: VoucherGateway
): Promise<void> => {
  const voucherStore = useVoucherStore()
  voucherStore.startSaving()
  try {
    await voucherGateway.delete(uuid)
    voucherStore.delete(uuid)
  } finally {
    voucherStore.stopSaving()
  }
}
