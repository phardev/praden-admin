import { useIndexStore } from '@store/indexStore'

export interface IndexProductsVM {
  total: number
  indexedProducts: number
}

export const indexProductsVM = (): IndexProductsVM => {
  const indexStore = useIndexStore()
  return {
    total: indexStore.count,
    indexedProducts: indexStore.indexedProducts
  }
}
