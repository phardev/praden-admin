import { createPinia, setActivePinia } from 'pinia'
import { PharmacistSelection } from '@core/entities/pharmacistSelection'
import { updatePharmacistSelection } from '@core/usecases/pharmacist-selection/updatePharmacistSelection'
import { InMemoryPharmacistSelectionGateway } from '@adapters/secondary/pharmacist-selection-gateways/inMemoryPharmacistSelectionGateway'
import { usePharmacistSelectionStore } from '@store/pharmacistSelectionStore'
import { pharmacistSelection1 } from '@utils/testData/pharmacistSelections'
import { UUID } from '@core/types/types'

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
      const newProductUuids: Array<UUID> = [
        'product-5',
        'product-6',
        'product-7'
      ]
      await whenUpdatePharmacistSelection(newProductUuids)
      const expected: PharmacistSelection = {
        productUuids: newProductUuids
      }
      expectSelectionToBe(expected)
    })
  })

  describe('Reorder products', () => {
    it('should update the selection in store with new order', async () => {
      givenExistingSelection(pharmacistSelection1)
      const reorderedUuids: Array<UUID> = [
        'product-3',
        'product-1',
        'product-2'
      ]
      await whenUpdatePharmacistSelection(reorderedUuids)
      const expected: PharmacistSelection = {
        productUuids: reorderedUuids
      }
      expectSelectionToBe(expected)
    })
  })

  describe('Loading state', () => {
    it('should set loading to true at start of update', () => {
      const newProductUuids: Array<UUID> = ['product-5']
      const promise = whenUpdatePharmacistSelection(newProductUuids)
      expectLoadingToBe(true)
      return promise
    })

    it('should set loading to false after update', async () => {
      const newProductUuids: Array<UUID> = ['product-5']
      await whenUpdatePharmacistSelection(newProductUuids)
      expectLoadingToBe(false)
    })
  })

  describe('Error handling', () => {
    it('should set error when gateway fails', async () => {
      const newProductUuids: Array<UUID> = ['product-5']
      givenGatewayWillFail()
      await whenUpdatePharmacistSelection(newProductUuids)
      expectErrorToBe('Failed to update pharmacist selection')
    })

    it('should set loading to false when gateway fails', async () => {
      const newProductUuids: Array<UUID> = ['product-5']
      givenGatewayWillFail()
      await whenUpdatePharmacistSelection(newProductUuids)
      expectLoadingToBe(false)
    })
  })

  const givenExistingSelection = (selection: PharmacistSelection) => {
    pharmacistSelectionGateway.feedWith(selection)
  }

  const givenGatewayWillFail = () => {
    pharmacistSelectionGateway.feedWithError(
      new Error('Failed to update pharmacist selection')
    )
  }

  const whenUpdatePharmacistSelection = async (productUuids: Array<UUID>) => {
    await updatePharmacistSelection(productUuids, pharmacistSelectionGateway)
  }

  const expectSelectionToBe = (selection: PharmacistSelection) => {
    expect(pharmacistSelectionStore.productUuids).toStrictEqual(
      selection.productUuids
    )
  }

  const expectLoadingToBe = (loading: boolean) => {
    expect(pharmacistSelectionStore.isLoading).toBe(loading)
  }

  const expectErrorToBe = (error: string) => {
    expect(pharmacistSelectionStore.error).toBe(error)
  }
})
