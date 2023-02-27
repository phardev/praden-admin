import { usePreparationStore } from '@store/preparationStore'
import { UUID } from '@core/types/types'

export const toggleSelectAllPreparations = (selection: Array<UUID>) => {
  const preparationStore = usePreparationStore()
  preparationStore.toggleSelectAll(selection)
}
