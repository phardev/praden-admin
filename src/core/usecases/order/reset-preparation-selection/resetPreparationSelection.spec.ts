import { resetPreparationSelection } from '@core/usecases/order/reset-preparation-selection/resetPreparationSelection'
import { usePreparationStore } from '@store/preparationStore'
import { createPinia, setActivePinia } from 'pinia'

describe('Reset preparation selection', () => {
  let preparationStore: any
  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
  })
  describe('There is no preparation selected', () => {
    it('should do nothing', () => {
      resetPreparationSelection()
      expect(preparationStore.selected).toStrictEqual([])
    })
  })
  describe('There is some preparations selected', () => {
    it('should do nothing', () => {
      preparationStore.selected = ['prep1', 'prep2']
      resetPreparationSelection()
      expect(preparationStore.selected).toStrictEqual([])
    })
  })
})
