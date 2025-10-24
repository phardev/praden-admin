import { toggleSelectPreparation } from '@core/usecases/order/toggle-select-preparation/toggleSelectPreparation'
import { usePreparationStore } from '@store/preparationStore'
import { createPinia, setActivePinia } from 'pinia'

describe('Toggle select preparations', () => {
  let preparationStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
  })
  describe('There is no preparations selected', () => {
    it('should be empty', () => {
      expect(preparationStore.selected).toStrictEqual([])
    })
    it('should allow to select one preparation', () => {
      toggleSelectPreparation('prep1')
      expect(preparationStore.selected).toStrictEqual(['prep1'])
    })
  })
  describe('There is some preparations selected', () => {
    beforeEach(() => {
      preparationStore.selected = ['selectedPrep']
    })
    it('should allow to add one preparation to selection', () => {
      toggleSelectPreparation('prep1')
      expect(preparationStore.selected).toStrictEqual(['selectedPrep', 'prep1'])
    })
    it('should remove the preparation if already selected', () => {
      toggleSelectPreparation('selectedPrep')
      expect(preparationStore.selected).toStrictEqual([])
    })
  })
})
