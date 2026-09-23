import { VoucherGateway } from '@core/gateways/voucherGateway'
import { useVoucherStore } from '@store/voucherStore'

export const suggestVoucherCode = async (
  voucherGateway: VoucherGateway
): Promise<void> => {
  const voucherStore = useVoucherStore()
  const code = await voucherGateway.suggestCode()
  voucherStore.setSuggestedCode(code)
}
