import { useFormStore } from '@store/formStore'
import { useLoyaltyConfigStore } from '@store/loyaltyConfigStore'

const FORM_KEY = 'loyalty-config-form'

export const loyaltyConfigFormVM = () => {
  const loyaltyConfigStore = useLoyaltyConfigStore()
  const formStore = useFormStore()

  const initForm = () => {
    const config = loyaltyConfigStore.config
    formStore.set(FORM_KEY, {
      pointsPerEuro: config?.pointsPerEuro ?? 1,
      isEnabled: config?.isEnabled ?? false
    })
  }

  const getPointsPerEuro = (): number => {
    return formStore.get(FORM_KEY)?.pointsPerEuro ?? 1
  }

  const setPointsPerEuro = (value: number) => {
    const current = formStore.get(FORM_KEY) ?? {}
    formStore.set(FORM_KEY, { ...current, pointsPerEuro: value })
  }

  const getIsEnabled = (): boolean => {
    return formStore.get(FORM_KEY)?.isEnabled ?? false
  }

  const setIsEnabled = (value: boolean) => {
    const current = formStore.get(FORM_KEY) ?? {}
    formStore.set(FORM_KEY, { ...current, isEnabled: value })
  }

  const getFormData = () => {
    return {
      pointsPerEuro: getPointsPerEuro(),
      isEnabled: getIsEnabled()
    }
  }

  const hasChanges = (): boolean => {
    const config = loyaltyConfigStore.config
    if (!config) return false
    const form = formStore.get(FORM_KEY)
    if (!form) return false
    return (
      form.pointsPerEuro !== config.pointsPerEuro ||
      form.isEnabled !== config.isEnabled
    )
  }

  const reset = () => {
    initForm()
  }

  return {
    initForm,
    get pointsPerEuro() {
      return getPointsPerEuro()
    },
    set pointsPerEuro(value: number) {
      setPointsPerEuro(value)
    },
    get isEnabled() {
      return getIsEnabled()
    },
    set isEnabled(value: boolean) {
      setIsEnabled(value)
    },
    get hasChanges() {
      return hasChanges()
    },
    get isLoading() {
      return loyaltyConfigStore.isLoading
    },
    getFormData,
    setPointsPerEuro,
    setIsEnabled,
    reset
  }
}
