import { UUID } from '@core/types/types'
import { usePreparationStore } from '@store/preparationStore'

export const selectPreparations = (selection: Array<UUID>) => {
  const preparationStore = usePreparationStore()
  preparationStore.select(selection)
}
