import type { Customer } from '@core/entities/customer'
import type { CartGateway } from '@core/gateways/cartGateway'
import type { CustomerGateway } from '@core/gateways/customerGateway'
import type { ProductGateway } from '@core/gateways/productGateway'
import { UUID } from '@core/types/types'
import { useManualOrderDraftStore } from '@store/manualOrderDraftStore'

export const prepareManualOrderFromCart = async (
  cartUuid: UUID,
  cartGateway: CartGateway,
  customerGateway: CustomerGateway,
  productGateway: ProductGateway
): Promise<void> => {
  const cart = await cartGateway.getByUuid(cartUuid)
  const [customer, products] = await Promise.all([
    customerOf(cart.customerUuid, customerGateway),
    productsOf(
      cart.lines.map((line) => line.productUuid),
      productGateway
    )
  ])
  useManualOrderDraftStore().set({
    cart,
    ...(customer && { customer }),
    products
  })
}

const customerOf = (
  customerUuid: UUID | undefined,
  customerGateway: CustomerGateway
): Promise<Customer | undefined> =>
  customerUuid
    ? customerGateway.getByUuid(customerUuid)
    : Promise.resolve(undefined)

const productsOf = (
  productUuids: Array<UUID>,
  productGateway: ProductGateway
) =>
  productUuids.length > 0
    ? productGateway.batch(productUuids)
    : Promise.resolve([])
