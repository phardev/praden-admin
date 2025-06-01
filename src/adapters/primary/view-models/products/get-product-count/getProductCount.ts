import { ProductGateway } from '@core/gateways/productGateway'
import { useIndexStore } from '@store/indexStore'

export const getProductCount = async (
  productGateway: ProductGateway
): Promise<void> => {
  const indexStore = useIndexStore()
  const count = await productGateway.count()
  indexStore.setCount(count)
}
