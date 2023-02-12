import { createPinia, setActivePinia } from 'pinia'
import { usePreparationStore } from '@store/preparationStore'
import { selectPreparations } from '@core/usecases/order/select-preparations/selectPreparations'

describe('Select preparations', () => {
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
      selectPreparations(['prep1'])
      expect(preparationStore.selected).toStrictEqual(['prep1'])
    })
    it('should allow to select multiple preparations', () => {
      selectPreparations(['prep1', 'prep2'])
      expect(preparationStore.selected).toStrictEqual(['prep1', 'prep2'])
    })
  })
  describe('There is some preparations selected', () => {
    beforeEach(() => {
      preparationStore.selected = ['selectedPrep']
    })
    it('should allow to add one preparation to selection', () => {
      selectPreparations(['prep1'])
      expect(preparationStore.selected).toStrictEqual(['selectedPrep', 'prep1'])
    })
    it('should allow to add multiple preparations to selection', () => {
      selectPreparations(['prep1', 'prep2'])
      expect(preparationStore.selected).toStrictEqual([
        'selectedPrep',
        'prep1',
        'prep2'
      ])
    })
  })
})
