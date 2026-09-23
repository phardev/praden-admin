import { useVoucherStore } from '@store/voucherStore'

export const removeAppliedVoucher = (): void => {
  const voucherStore = useVoucherStore()
  voucherStore.removeFromManualOrder()
}
