import type { DeliveryPriceRuleGateway } from '@core/gateways/deliveryPriceRuleGateway'
import type { UUID } from '@core/types/types'
import { useDeliveryPriceRuleStore } from '@store/deliveryPriceRuleStore'

export const getDeliveryPriceRule = async (
  uuid: UUID,
  gateway: DeliveryPriceRuleGateway
) => {
  const rule = await gateway.getByUuid(uuid)
  const store = useDeliveryPriceRuleStore()
  store.setCurrent(rule)
}
