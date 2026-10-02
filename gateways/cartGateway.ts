import { InMemoryCartGateway } from '@adapters/secondary/cart-gateways/InMemoryCartGateway'
import { RealCartGateway } from '@adapters/secondary/cart-gateways/RealCartGateway'
import { isLocalEnv } from '@utils/env'
import {
  elodieCart,
  elodieCartDetail,
  elodieClosedCartItem,
  elodieOpenCartItem,
  guestCartDetail,
  guestOpenCartItem,
  lucasAbandonedCartItem
} from '@utils/testData/carts'

const cartGateway = new InMemoryCartGateway()
cartGateway.feedWithCustomerCarts(elodieCart)
cartGateway.feedWithCartDetails(elodieCartDetail, guestCartDetail)
cartGateway.feedWithListItems(
  elodieOpenCartItem,
  guestOpenCartItem,
  lucasAbandonedCartItem,
  elodieClosedCartItem
)

export const useCartGateway = () => {
  if (isLocalEnv()) {
    return cartGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealCartGateway(BACKEND_URL)
}
