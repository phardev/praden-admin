import { VoucherGateway } from '@core/gateways/voucherGateway'
import { UUID } from '@core/types/types'
import { useVoucherStore } from '@store/voucherStore'

export const getVoucher = async (
  uuid: UUID,
  voucherGateway: VoucherGateway
): Promise<void> => {
  const voucherStore = useVoucherStore()
  voucherStore.startLoading()
  try {
    const voucher = await voucherGateway.getByUuid(uuid)
    voucherStore.setCurrent(voucher)
  } finally {
    voucherStore.stopLoading()
  }
}
