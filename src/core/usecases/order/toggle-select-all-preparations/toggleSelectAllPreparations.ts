import { UUID } from '@core/types/types'
import { usePreparationStore } from '@store/preparationStore'

export const toggleSelectAllPreparations = (selection: Array<UUID>) => {
  const preparationStore = usePreparationStore()
  preparationStore.toggleSelectAll(selection)
}
