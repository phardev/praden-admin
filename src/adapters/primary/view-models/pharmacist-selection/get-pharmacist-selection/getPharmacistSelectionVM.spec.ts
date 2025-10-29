import { getPharmacistSelectionVM } from '@adapters/primary/view-models/pharmacist-selection/get-pharmacist-selection/getPharmacistSelectionVM'
import { usePharmacistSelectionStore } from '@store/pharmacistSelectionStore'
import { pharmacistSelection1 } from '@utils/testData/pharmacistSelections'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

describe('GetPharmacistSelectionVM', () => {
  let pharmacistSelectionStore: ReturnType<typeof usePharmacistSelectionStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    pharmacistSelectionStore = usePharmacistSelectionStore()
  })

  it('should return empty selection and loading false by default', () => {
    const vm = getPharmacistSelectionVM()

    expect(vm).toStrictEqual({
      selection: [],
      isLoading: false,
      error: null
    })
  })

  it('should return selection from store', () => {
    pharmacistSelectionStore.setSelection(pharmacistSelection1)

    const vm = getPharmacistSelectionVM()

    expect(vm).toStrictEqual({
      selection: pharmacistSelection1,
      isLoading: false,
      error: null
    })
  })

  it('should return loading state from store', () => {
    pharmacistSelectionStore.startLoading()

    const vm = getPharmacistSelectionVM()

    expect(vm).toStrictEqual({
      selection: [],
      isLoading: true,
      error: null
    })
  })

  it('should return error state from store', () => {
    pharmacistSelectionStore.setError('Test error')

    const vm = getPharmacistSelectionVM()

    expect(vm).toStrictEqual({
      selection: [],
      isLoading: false,
      error: 'Test error'
    })
  })
})
