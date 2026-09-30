import type { CustomerGateway } from '@core/gateways/customerGateway'
import type { ProductGateway } from '@core/gateways/productGateway'
import { UUID } from '@core/types/types'
import { useManualOrderDraftStore } from '@store/manualOrderDraftStore'

export const prepareManualOrderFromCart = async (
  customerUuid: UUID,
  customerGateway: CustomerGateway,
  productGateway: ProductGateway
): Promise<void> => {
  const customer = await customerGateway.getByUuid(customerUuid)
  const productUuids = (customer.currentCart?.lines ?? []).map(
    (line) => line.productUuid
  )
  const products =
    productUuids.length > 0 ? await productGateway.batch(productUuids) : []
  useManualOrderDraftStore().set({ customer, products })
}
