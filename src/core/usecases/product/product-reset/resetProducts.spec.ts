import { resetProducts } from '@core/usecases/product/product-reset/resetProducts'
import { useProductStore } from '@store/productStore'
import { createPinia, setActivePinia } from 'pinia'

describe('Reset products', () => {
  let productStore: any
  beforeEach(() => {
    setActivePinia(createPinia())
    productStore = useProductStore()
  })

  describe('There are no products in the store', () => {
    it('should reset to initial state', () => {
      resetProducts()
      expect(productStore.items).toStrictEqual([])
    })
  })

  describe('There are products in the store', () => {
    it('should clear all products', () => {
      productStore.items = [{ uuid: 'product-1' }, { uuid: 'product-2' }]
      resetProducts()
      expect(productStore.items).toStrictEqual([])
    })
  })

  describe('hasMore is false', () => {
    it('should reset hasMore to true', () => {
      productStore.hasMore = false
      resetProducts()
      expect(productStore.hasMore).toStrictEqual(true)
    })
  })

  describe('isLoading is true', () => {
    it('should reset isLoading to false', () => {
      productStore.isLoading = true
      resetProducts()
      expect(productStore.isLoading).toStrictEqual(false)
    })
  })
})
