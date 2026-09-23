import { CreateVoucherDTO } from '@core/entities/voucher'
import { VoucherGateway } from '@core/gateways/voucherGateway'
import { Timestamp, UUID } from '@core/types/types'
import { useVoucherStore } from '@store/voucherStore'

export type EditVoucherDTO = Partial<
  Omit<CreateVoucherDTO, 'expirationDate'>
> & {
  expirationDate?: Timestamp | null
}

export const editVoucher = async (
  uuid: UUID,
  dto: EditVoucherDTO,
  voucherGateway: VoucherGateway
): Promise<void> => {
  const voucherStore = useVoucherStore()
  voucherStore.startSaving()
  try {
    const edited = await voucherGateway.edit(uuid, dto)
    voucherStore.edit(edited)
  } finally {
    voucherStore.stopSaving()
  }
}
