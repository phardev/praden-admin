import { VoucherPagination, VoucherStatus } from '@core/entities/voucher'
import { VoucherGateway } from '@core/gateways/voucherGateway'
import { useVoucherStore } from '@store/voucherStore'

export const listVouchers = async (
  status: VoucherStatus,
  pagination: VoucherPagination,
  voucherGateway: VoucherGateway
): Promise<void> => {
  const voucherStore = useVoucherStore()
  voucherStore.startLoading()
  try {
    const vouchers = await voucherGateway.list(status, pagination)
    if (pagination.offset === 0) {
      voucherStore.list(status, vouchers)
    } else {
      voucherStore.append(status, vouchers)
    }
    voucherStore.setHasMore(status, vouchers.length === pagination.limit)
  } finally {
    voucherStore.stopLoading()
  }
}
