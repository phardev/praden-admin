import { useProductStore } from '@store/productStore'

export const resetProducts = () => {
  const productStore = useProductStore()
  productStore.reset()
}
