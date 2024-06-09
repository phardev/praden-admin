import { usePreparationStore } from '@store/preparationStore'

export const clearPreparationError = (): void => {
  const preparationStore = usePreparationStore()
  preparationStore.clearError()
}
