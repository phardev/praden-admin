import type { DeliveryPriceRuleGateway } from '@core/gateways/deliveryPriceRuleGateway'
import type { UUID } from '@core/types/types'
import { useDeliveryPriceRuleStore } from '@store/deliveryPriceRuleStore'

export const deleteDeliveryPriceRule = async (
  uuid: UUID,
  gateway: DeliveryPriceRuleGateway
) => {
  await gateway.delete(uuid)
  const store = useDeliveryPriceRuleStore()
  store.remove(uuid)
}
