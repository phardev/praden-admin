import { usePreparationStore } from '@store/preparationStore'
import { createPinia, setActivePinia } from 'pinia'
import { getSelectedPreparationsVM } from '@adapters/primary/view-models/get-selected-preparations/getSelectedPreparationsVM'

describe('Get selected preparations VM', () => {
  let preparationStore: any
  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
  })
  describe('There is no preparation selected', () => {
    it('should return an empty list', () => {
      const vm = getSelectedPreparationsVM()
      const expectedVM = {
        items: []
      }
      expect(vm).toStrictEqual(expectedVM)
    })
  })
  describe('There is some preparations selected', () => {
    beforeEach(() => {
      preparationStore.selected = ['prep1', 'prep2']
    })
    it('should return an empty list', () => {
      const vm = getSelectedPreparationsVM()
      const expectedVM = {
        items: ['prep1', 'prep2']
      }
      expect(vm).toStrictEqual(expectedVM)
    })
  })
})
