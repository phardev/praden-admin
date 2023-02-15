import { usePreparationStore } from '@store/preparationStore'

export const toggleSelectAllPreparations = () => {
  const preparationStore = usePreparationStore()
  preparationStore.toggleSelectAll()
}
