import { discountCodeErrorMessageKey } from '@adapters/primary/view-models/welcome-codes/discount-code-error/discountCodeErrorMessageVM'

export const useDiscountCodeErrorToast = () => {
  const { t } = useI18n()

  const showDiscountCodeError = (error: unknown) => {
    useToast().add({
      title: t(discountCodeErrorMessageKey(error)),
      color: 'red'
    })
  }

  const showDiscountCodeSuccess = (key: string) => {
    useToast().add({ title: t(key), color: 'green' })
  }

  return { showDiscountCodeError, showDiscountCodeSuccess }
}
