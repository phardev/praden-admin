import { InMemoryDeliveryPriceRuleGateway } from '@adapters/secondary/delivery-price-rule-gateways/inMemoryDeliveryPriceRuleGateway'
import { RealDeliveryPriceRuleGateway } from '@adapters/secondary/delivery-price-rule-gateways/realDeliveryPriceRuleGateway'
import { isLocalEnv } from '@utils/env'
import * as deliveryPriceRules from '@utils/testData/deliveryPriceRules'
import { useDateProvider } from './dateProvider'
import { useUuidGenerator } from './uuidGenerator'

const deliveryPriceRuleGateway = new InMemoryDeliveryPriceRuleGateway(
  useUuidGenerator(),
  useDateProvider()
)
deliveryPriceRuleGateway.feedWith(
  deliveryPriceRules.freeShippingOver39,
  deliveryPriceRules.standardShipping,
  deliveryPriceRules.christmasFreeShipping,
  deliveryPriceRules.inactiveRule
)

export const useDeliveryPriceRuleGateway = () => {
  if (isLocalEnv()) {
    return deliveryPriceRuleGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealDeliveryPriceRuleGateway(BACKEND_URL)
}
