import { createPinia, setActivePinia } from 'pinia'
import { useIndexStore } from '@store/indexStore'
import {
  indexProductsVM,
  IndexProductsVM
} from '@adapters/primary/view-models/index/index-products/indexProductsVM'

describe('Index products VM', () => {
  let indexStore: any
  let vm: IndexProductsVM

  beforeEach(() => {
    setActivePinia(createPinia())
    indexStore = useIndexStore()
  })
  describe('Initial state', () => {
    it('should not have any product to index', () => {
      whenGetVM()
      expectVMToEqual({ total: 0, indexedProducts: 0 })
    })
  })

  describe('There is products to index', () => {
    it('should have some products to index', () => {
      indexStore.count = 10
      indexStore.indexedProducts = 5
      whenGetVM()
      expectVMToEqual({ total: 10, indexedProducts: 5 })
    })
  })

  const whenGetVM = () => {
    vm = indexProductsVM()
  }

  const expectVMToEqual = (expected: IndexProductsVM) => {
    expect(vm).toStrictEqual(expected)
  }
})
