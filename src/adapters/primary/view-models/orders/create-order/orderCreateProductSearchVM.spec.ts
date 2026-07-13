import { useSearchStore } from '@store/searchStore'
import { productPromotionPercentage } from '@utils/testData/productPromotions'
import { dolodent, ultraLevure } from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'
import type { OrderCreateProductSearchVM } from './orderCreateProductSearchVM'
import { orderCreateProductSearchVM } from './orderCreateProductSearchVM'

describe('Order create product search VM', () => {
  let searchStore: ReturnType<typeof useSearchStore>
  const namespace = 'order-create-product'
  const NOW = productPromotionPercentage.startDate! + 1

  beforeEach(() => {
    setActivePinia(createPinia())
    searchStore = useSearchStore()
  })

  describe('Given no search yet, when getting VM, then returns empty results', () => {
    it('should return empty results', () => {
      const expectedVM: OrderCreateProductSearchVM = {
        results: [],
        isLoading: false,
        hasError: false
      }
      expect(orderCreateProductSearchVM(namespace, [], NOW)).toStrictEqual(
        expectedVM
      )
    })
  })

  describe('Given search results, when getting VM, then formats products with price and stock', () => {
    it('should format the products with price with tax and stock', () => {
      searchStore.set(namespace, [dolodent, ultraLevure])
      const expectedVM: OrderCreateProductSearchVM = {
        results: [
          {
            uuid: dolodent.uuid,
            name: dolodent.name,
            ean13: dolodent.ean13,
            miniature: dolodent.miniature,
            formattedPriceWithTax: '5,50 €',
            hasPromotion: false,
            availableStock: dolodent.availableStock,
            isAdded: false
          },
          {
            uuid: ultraLevure.uuid,
            name: ultraLevure.name,
            ean13: ultraLevure.ean13,
            miniature: ultraLevure.miniature,
            formattedPriceWithTax: '4,75 €',
            hasPromotion: false,
            availableStock: ultraLevure.availableStock,
            isAdded: true
          }
        ],
        isLoading: false,
        hasError: false
      }
      expect(
        orderCreateProductSearchVM(namespace, [ultraLevure.uuid], NOW)
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given a result with an active promotion, when getting VM, then the price is discounted', () => {
    it('should display the discounted price with a promotion flag', () => {
      searchStore.set(namespace, [
        { ...dolodent, promotions: [productPromotionPercentage] }
      ])
      const expectedVM: OrderCreateProductSearchVM = {
        results: [
          {
            uuid: dolodent.uuid,
            name: dolodent.name,
            ean13: dolodent.ean13,
            miniature: dolodent.miniature,
            formattedPriceWithTax: '4,95 €',
            hasPromotion: true,
            availableStock: dolodent.availableStock,
            isAdded: false
          }
        ],
        isLoading: false,
        hasError: false
      }
      expect(orderCreateProductSearchVM(namespace, [], NOW)).toStrictEqual(
        expectedVM
      )
    })
  })

  describe('Given a result with an ended promotion, when getting VM, then the catalog price applies', () => {
    it('should ignore the ended promotion', () => {
      searchStore.set(namespace, [
        { ...dolodent, promotions: [productPromotionPercentage] }
      ])
      const expectedVM: OrderCreateProductSearchVM = {
        results: [
          {
            uuid: dolodent.uuid,
            name: dolodent.name,
            ean13: dolodent.ean13,
            miniature: dolodent.miniature,
            formattedPriceWithTax: '5,50 €',
            hasPromotion: false,
            availableStock: dolodent.availableStock,
            isAdded: false
          }
        ],
        isLoading: false,
        hasError: false
      }
      expect(
        orderCreateProductSearchVM(
          namespace,
          [],
          productPromotionPercentage.endDate! + 1
        )
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given the search is loading, when getting VM, then returns the loading state', () => {
    it('should return the loading state', () => {
      searchStore.startLoading(namespace)
      const expectedVM: OrderCreateProductSearchVM = {
        results: [],
        isLoading: true,
        hasError: false
      }
      expect(orderCreateProductSearchVM(namespace, [], NOW)).toStrictEqual(
        expectedVM
      )
    })
  })

  describe('Given a search error, when getting VM, then returns the error state', () => {
    it('should return the error state', () => {
      searchStore.setError(namespace, 'query is too short')
      const expectedVM: OrderCreateProductSearchVM = {
        results: [],
        isLoading: false,
        hasError: true
      }
      expect(orderCreateProductSearchVM(namespace, [], NOW)).toStrictEqual(
        expectedVM
      )
    })
  })
})
