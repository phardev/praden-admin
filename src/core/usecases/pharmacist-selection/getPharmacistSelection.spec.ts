import { createPinia, setActivePinia } from 'pinia'
import { PharmacistSelection } from '@core/entities/pharmacistSelection'
import { getPharmacistSelection } from '@core/usecases/pharmacist-selection/getPharmacistSelection'
import { InMemoryPharmacistSelectionGateway } from '@adapters/secondary/pharmacist-selection-gateways/inMemoryPharmacistSelectionGateway'
import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { usePharmacistSelectionStore } from '@store/pharmacistSelectionStore'
import { useProductStore } from '@store/productStore'
import {
  pharmacistSelection1,
  pharmacistSelection2
} from '@utils/testData/pharmacistSelections'
import {
  dolodent,
  ultraLevure,
  anaca3Minceur,
  chamomilla
} from '@utils/testData/products'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'

describe('PharmacistSelection get', () => {
  let pharmacistSelectionStore: ReturnType<typeof usePharmacistSelectionStore>
  let productStore: ReturnType<typeof useProductStore>
  let pharmacistSelectionGateway: InMemoryPharmacistSelectionGateway
  let productGateway: InMemoryProductGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    pharmacistSelectionStore = usePharmacistSelectionStore()
    productStore = useProductStore()
    pharmacistSelectionGateway = new InMemoryPharmacistSelectionGateway()
    productGateway = new InMemoryProductGateway(new FakeUuidGenerator())
  })

  describe('Get pharmacist selection', () => {
    it('should save the selection in the store', async () => {
      givenExistingSelection(pharmacistSelection1)
      await whenGetPharmacistSelection()
      expectSelectionToBe(pharmacistSelection1)
    })

    it('should save the products from selection in the product store', async () => {
      givenExistingSelection(pharmacistSelection1)
      givenProductsForSelection([
        dolodent,
        ultraLevure,
        anaca3Minceur,
        chamomilla
      ])
      await whenGetPharmacistSelection()
      expectProductsInStoreToBe([
        dolodent,
        ultraLevure,
        anaca3Minceur,
        chamomilla
      ])
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

  const givenExistingSelection = (selection: PharmacistSelection) => {
    pharmacistSelectionGateway.feedWith(selection)
  }

  const givenProductsForSelection = (products: Array<any>) => {
    productGateway.feedWith(...products)
  }

  const givenGatewayWillFail = () => {
    pharmacistSelectionGateway.feedWithError(
      new Error('Failed to fetch pharmacist selection')
    )
  }

  const whenGetPharmacistSelection = async () => {
    await getPharmacistSelection(pharmacistSelectionGateway, productGateway)
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

  const expectProductsInStoreToBe = (products: Array<any>) => {
    expect(productStore.items).toStrictEqual(products)
  }
})
