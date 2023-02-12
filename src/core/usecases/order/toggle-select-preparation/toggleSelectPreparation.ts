import { UUID } from '@core/types/types'
import { usePreparationStore } from '@store/preparationStore'

export const toggleSelectPreparation = (selection: UUID) => {
  const preparationStore = usePreparationStore()
  preparationStore.select(selection)
}
