import { createPinia, setActivePinia } from 'pinia'
import { useSearchStore } from '@store/searchStore'
import { useProductStore } from '@store/productStore'
import { ProductSearchVM, productSearchVM } from './productSearchVM'
import { dolodent, ultraLevure } from '@utils/testData/products'

describe('Product Search VM', () => {
  let searchStore: any
  let productStore: any
  const namespace = 'product-search-modal'
  let expectedVM: Partial<ProductSearchVM>

  beforeEach(() => {
    setActivePinia(createPinia())
    searchStore = useSearchStore()
    productStore = useProductStore()
  })

  describe('Given empty search results, when getting VM, then returns empty search results', () => {
    it('should return empty search results', () => {
      expectedVM = {
        searchResults: [],
        isLoading: false,
        hasError: false,
        errorMessage: undefined
      }
      expect(productSearchVM(namespace, [])).toStrictEqual(expectedVM)
    })
  })

  describe('Given search result with one product, when getting VM, then formats product with price', () => {
    it('should format product with calculated price with tax', () => {
      searchStore.set(namespace, [dolodent])
      expectedVM = {
        searchResults: [
          {
            uuid: dolodent.uuid,
            name: dolodent.name,
            miniature: dolodent.miniature,
            priceWithTax: 550,
            formattedPrice: '5,50\u00A0€',
            isSelected: false
          }
        ],
        isLoading: false,
        hasError: false,
        errorMessage: undefined
      }
      expect(productSearchVM(namespace, [])).toStrictEqual(expectedVM)
    })
  })

  describe('Given product uuid in selectedProductUuids, when getting VM, then marks product as selected', () => {
    it('should mark product as selected', () => {
      searchStore.set(namespace, [dolodent])
      expectedVM = {
        searchResults: [
          {
            uuid: dolodent.uuid,
            name: dolodent.name,
            miniature: dolodent.miniature,
            priceWithTax: 550,
            formattedPrice: '5,50\u00A0€',
            isSelected: true
          }
        ],
        isLoading: false,
        hasError: false,
        errorMessage: undefined
      }
      expect(productSearchVM(namespace, [dolodent.uuid])).toStrictEqual(
        expectedVM
      )
    })
  })

  describe('Given productStore is loading, when getting VM, then returns loading state', () => {
    it('should return loading state', () => {
      productStore.isLoading = true
      expectedVM = {
        searchResults: [],
        isLoading: true,
        hasError: false,
        errorMessage: undefined
      }
      expect(productSearchVM(namespace, [])).toStrictEqual(expectedVM)
    })
  })

  describe('Given search error, when getting VM, then returns error state', () => {
    it('should return error state with message', () => {
      searchStore.setError(namespace, 'ab')
      expectedVM = {
        searchResults: [],
        isLoading: false,
        hasError: true,
        errorMessage: 'Veuillez saisir au moins 3 caractères'
      }
      expect(productSearchVM(namespace, [])).toStrictEqual(expectedVM)
    })
  })

  describe('Given multiple products in search results, when getting VM, then formats all products', () => {
    it('should format all products with selection state', () => {
      searchStore.set(namespace, [dolodent, ultraLevure])
      expectedVM = {
        searchResults: [
          {
            uuid: dolodent.uuid,
            name: dolodent.name,
            miniature: dolodent.miniature,
            priceWithTax: 550,
            formattedPrice: '5,50\u00A0€',
            isSelected: true
          },
          {
            uuid: ultraLevure.uuid,
            name: ultraLevure.name,
            miniature: ultraLevure.miniature,
            priceWithTax: 475,
            formattedPrice: '4,75\u00A0€',
            isSelected: false
          }
        ],
        isLoading: false,
        hasError: false,
        errorMessage: undefined
      }
      expect(productSearchVM(namespace, [dolodent.uuid])).toStrictEqual(
        expectedVM
      )
    })
  })
})
