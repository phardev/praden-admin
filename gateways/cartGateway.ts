import { InMemoryCartGateway } from '@adapters/secondary/cart-gateways/InMemoryCartGateway'
import { RealCartGateway } from '@adapters/secondary/cart-gateways/RealCartGateway'
import { isLocalEnv } from '@utils/env'
import {
  elodieCart,
  elodieClosedCartItem,
  elodieOpenCartItem,
  guestOpenCartItem,
  lucasAbandonedCartItem
} from '@utils/testData/carts'

const cartGateway = new InMemoryCartGateway()
cartGateway.feedWithCustomerCarts(elodieCart)
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
