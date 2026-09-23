import { CreateVoucherDTO } from '@core/entities/voucher'
import { VoucherGateway } from '@core/gateways/voucherGateway'
import { useVoucherStore } from '@store/voucherStore'

export const createVoucher = async (
  dto: CreateVoucherDTO,
  voucherGateway: VoucherGateway
): Promise<void> => {
  const voucherStore = useVoucherStore()
  voucherStore.startSaving()
  try {
    const created = await voucherGateway.create(dto)
    voucherStore.create(created)
  } finally {
    voucherStore.stopSaving()
  }
}
