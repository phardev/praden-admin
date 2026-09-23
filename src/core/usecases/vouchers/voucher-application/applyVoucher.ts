import type { Address } from '@core/entities/order'
import { VoucherGateway } from '@core/gateways/voucherGateway'
import type { UUID } from '@core/types/types'
import type { CreateManualOrderLineDTO } from '@core/usecases/order/manual-order-creation/createManualOrder'
import { useVoucherStore } from '@store/voucherStore'

export interface ApplyVoucherDTO {
  code: string
  customerUuid: UUID
  lines: Array<CreateManualOrderLineDTO>
  deliveryAddress: Address
  deliveryMethodUuid: UUID
}

export const applyVoucher = async (
  dto: ApplyVoucherDTO,
  voucherGateway: VoucherGateway
): Promise<void> => {
  const voucherStore = useVoucherStore()
  voucherStore.removeFromManualOrder()
  voucherStore.startApplying()
  try {
    const discount = await voucherGateway.apply(dto)
    voucherStore.applyToManualOrder({ request: dto, discount })
  } finally {
    voucherStore.stopApplying()
  }
}
