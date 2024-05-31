import { ProductGateway } from '@core/gateways/productGateway'
import { UUID } from '@core/types/types'
import { useProductStore } from '@store/productStore'

export const getProduct = async (
  uuid: UUID,
  productGateway: ProductGateway
): Promise<void> => {
  const product = await productGateway.getByUuid(uuid)
  const productStore = useProductStore()
  productStore.setCurrent(product)
}
