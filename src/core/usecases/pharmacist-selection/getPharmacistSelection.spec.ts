import { InMemoryPharmacistSelectionGateway } from '@adapters/secondary/pharmacist-selection-gateways/inMemoryPharmacistSelectionGateway'
import { PharmacistSelection } from '@core/entities/pharmacistSelection'
import { getPharmacistSelection } from '@core/usecases/pharmacist-selection/getPharmacistSelection'
import { usePharmacistSelectionStore } from '@store/pharmacistSelectionStore'
import {
  pharmacistSelection1,
  pharmacistSelection2
} from '@utils/testData/pharmacistSelections'
import { createPinia, setActivePinia } from 'pinia'

describe('PharmacistSelection get', () => {
  let pharmacistSelectionStore: ReturnType<typeof usePharmacistSelectionStore>
  let pharmacistSelectionGateway: InMemoryPharmacistSelectionGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    pharmacistSelectionStore = usePharmacistSelectionStore()
    pharmacistSelectionGateway = new InMemoryPharmacistSelectionGateway()
  })

  describe('Get pharmacist selection', () => {
    it('should save the selection in the store', async () => {
      givenExistingSelection(pharmacistSelection1)
      await whenGetPharmacistSelection()
      expectSelectionToBe(pharmacistSelection1)
    })

    it('should set loading to true at start of getting selection', () => {
      givenExistingSelection(pharmacistSelection1)
      const promise = whenGetPharmacistSelection()
      expectLoadingToBe(true)
      return promise
    })

    it('should set loading to false after getting selection', async () => {
      givenExistingSelection(pharmacistSelection1)
      await whenGetPharmacistSelection()
      expectLoadingToBe(false)
    })
  })

  describe('Get another pharmacist selection', () => {
    it('should save the selection in the store', async () => {
      givenExistingSelection(pharmacistSelection2)
      await whenGetPharmacistSelection()
      expectSelectionToBe(pharmacistSelection2)
    })
  })

  describe('Error handling', () => {
    it('should set error when gateway fails', async () => {
      givenGatewayWillFail()
      await whenGetPharmacistSelection()
      expectErrorToBe('Failed to fetch pharmacist selection')
    })

    it('should set loading to false when gateway fails', async () => {
      givenGatewayWillFail()
      await whenGetPharmacistSelection()
      expectLoadingToBe(false)
    })
  })

  const givenExistingSelection = (selection: Array<PharmacistSelection>) => {
    pharmacistSelectionGateway.feedWith(...selection)
  }

  const givenGatewayWillFail = () => {
    pharmacistSelectionGateway.feedWithError(
      new Error('Failed to fetch pharmacist selection')
    )
  }

  const whenGetPharmacistSelection = async () => {
    await getPharmacistSelection(pharmacistSelectionGateway)
  }

  const expectSelectionToBe = (selection: Array<PharmacistSelection>) => {
    expect(pharmacistSelectionStore.selection).toStrictEqual(selection)
  }

  const expectLoadingToBe = (loading: boolean) => {
    expect(pharmacistSelectionStore.isLoading).toBe(loading)
  }

  const expectErrorToBe = (error: string) => {
    expect(pharmacistSelectionStore.error).toBe(error)
  }
})
