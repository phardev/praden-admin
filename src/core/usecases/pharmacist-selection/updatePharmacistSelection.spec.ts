import { InMemoryPharmacistSelectionGateway } from '@adapters/secondary/pharmacist-selection-gateways/inMemoryPharmacistSelectionGateway'
import { PharmacistSelection } from '@core/entities/pharmacistSelection'
import { updatePharmacistSelection } from '@core/usecases/pharmacist-selection/updatePharmacistSelection'
import { usePharmacistSelectionStore } from '@store/pharmacistSelectionStore'
import {
  pharmacistSelection1,
  pharmacistSelection2
} from '@utils/testData/pharmacistSelections'
import { createPinia, setActivePinia } from 'pinia'

describe('PharmacistSelection update', () => {
  let pharmacistSelectionStore: ReturnType<typeof usePharmacistSelectionStore>
  let pharmacistSelectionGateway: InMemoryPharmacistSelectionGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    pharmacistSelectionStore = usePharmacistSelectionStore()
    pharmacistSelectionGateway = new InMemoryPharmacistSelectionGateway()
  })

  describe('Update product list', () => {
    it('should update the selection in store', async () => {
      givenExistingSelection(pharmacistSelection1)
      await whenUpdatePharmacistSelection(pharmacistSelection2)
      expectSelectionToBe(pharmacistSelection2)
    })
  })

  describe('Reorder products', () => {
    it('should update the selection in store with new order', async () => {
      givenExistingSelection(pharmacistSelection1)
      const reordered: Array<PharmacistSelection> = [
        pharmacistSelection1[2],
        pharmacistSelection1[0],
        pharmacistSelection1[1]
      ]
      await whenUpdatePharmacistSelection(reordered)
      expectSelectionToBe(reordered)
    })
  })

  describe('Loading state', () => {
    it('should set loading to true at start of update', () => {
      const promise = whenUpdatePharmacistSelection(pharmacistSelection2)
      expectLoadingToBe(true)
      return promise
    })

    it('should set loading to false after update', async () => {
      await whenUpdatePharmacistSelection(pharmacistSelection2)
      expectLoadingToBe(false)
    })
  })

  describe('Error handling', () => {
    it('should set error when gateway fails', async () => {
      givenGatewayWillFail()
      await whenUpdatePharmacistSelection(pharmacistSelection2)
      expectErrorToBe('Failed to update pharmacist selection')
    })

    it('should set loading to false when gateway fails', async () => {
      givenGatewayWillFail()
      await whenUpdatePharmacistSelection(pharmacistSelection2)
      expectLoadingToBe(false)
    })
  })

  const givenExistingSelection = (selection: Array<PharmacistSelection>) => {
    pharmacistSelectionGateway.feedWith(...selection)
  }

  const givenGatewayWillFail = () => {
    pharmacistSelectionGateway.feedWithError(
      new Error('Failed to update pharmacist selection')
    )
  }

  const whenUpdatePharmacistSelection = async (
    selection: Array<PharmacistSelection>
  ) => {
    await updatePharmacistSelection(selection, pharmacistSelectionGateway)
  }

  const expectSelectionToBe = (expected: Array<PharmacistSelection>) => {
    expect(pharmacistSelectionStore.selection).toStrictEqual(expected)
  }

  const expectLoadingToBe = (loading: boolean) => {
    expect(pharmacistSelectionStore.isLoading).toBe(loading)
  }

  const expectErrorToBe = (error: string) => {
    expect(pharmacistSelectionStore.error).toBe(error)
  }
})
