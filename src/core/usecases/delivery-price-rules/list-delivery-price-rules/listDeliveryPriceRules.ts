import type { DeliveryPriceRuleGateway } from '@core/gateways/deliveryPriceRuleGateway'
import { useDeliveryPriceRuleStore } from '@store/deliveryPriceRuleStore'

export const listDeliveryPriceRules = async (
  gateway: DeliveryPriceRuleGateway
) => {
  const rules = await gateway.list()
  const store = useDeliveryPriceRuleStore()
  store.list(rules)
}
