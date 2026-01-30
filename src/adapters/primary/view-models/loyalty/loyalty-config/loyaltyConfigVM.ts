import { useFormStore } from '@store/formStore'
import { useLoyaltyStore } from '@store/loyaltyStore'

const FORM_KEY = 'loyalty-config-form'

export const loyaltyConfigVM = () => {
  const loyaltyStore = useLoyaltyStore()
  const formStore = useFormStore()

  const initialValue = loyaltyStore.config?.eurosPerPoint ?? 0

  formStore.set(FORM_KEY, { eurosPerPoint: initialValue })

  const getFormValue = (): number => {
    return formStore.get(FORM_KEY)?.eurosPerPoint ?? 0
  }

  const setEurosPerPoint = (value: number) => {
    formStore.set(FORM_KEY, { eurosPerPoint: value })
  }

  const getConfigForSave = (): number => {
    return getFormValue()
  }

  const reset = () => {
    const originalValue = loyaltyStore.config?.eurosPerPoint ?? 0
    formStore.set(FORM_KEY, { eurosPerPoint: originalValue })
  }

  return {
    get eurosPerPoint() {
      return getFormValue()
    },
    get hasChanges() {
      const currentValue = getFormValue()
      const originalValue = loyaltyStore.config?.eurosPerPoint ?? 0
      return currentValue !== originalValue
    },
    setEurosPerPoint,
    getConfigForSave,
    reset
  }
}
