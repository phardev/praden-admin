import { voucherErrorMessageKey } from '@adapters/primary/view-models/vouchers/voucher-error/voucherErrorMessageVM'

export const useVoucherErrorToast = () => {
  const { t } = useI18n()

  const showVoucherError = (error: unknown) => {
    useToast().add({ title: t(voucherErrorMessageKey(error)), color: 'red' })
  }

  const showVoucherSuccess = (key: string) => {
    useToast().add({ title: t(key), color: 'green' })
  }

  return { showVoucherError, showVoucherSuccess }
}
