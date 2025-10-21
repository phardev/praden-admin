import { EditProductDTO } from './editProduct'
import { UUID } from '@core/types/types'
import { ProductGateway } from '@core/gateways/productGateway'
import { useProductStore } from '@store/productStore'

export interface BulkEditProductDependencies {
  productGateway: ProductGateway
}

export const bulkEditProduct =
  ({ productGateway }: BulkEditProductDependencies) =>
  async ({
    uuids,
    dto
  }: {
    uuids: Array<UUID>
    dto: EditProductDTO
  }): Promise<void> => {
    const productStore = useProductStore()
    productStore.startLoading()
    try {
      const updatedProducts = await productGateway.bulkEdit(dto, uuids)
      updatedProducts.forEach((product) => {
        productStore.edit(product)
      })
    } finally {
      productStore.stopLoading()
    }
  }
