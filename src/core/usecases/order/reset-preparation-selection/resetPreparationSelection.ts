import { usePreparationStore } from '@store/preparationStore'

export const resetPreparationSelection = () => {
  const preparationStore = usePreparationStore()
  preparationStore.resetSelection()
}
