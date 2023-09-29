import { UUID } from '@core/types/types'
import { usePreparationStore } from '@store/preparationStore'

export interface GetSelectedPreparationsVM {
  items: Array<UUID>
}

export const getSelectedPreparationsVM = (): GetSelectedPreparationsVM => {
  const preparationStore = usePreparationStore()
  return {
    items: preparationStore.selected
  }
}
