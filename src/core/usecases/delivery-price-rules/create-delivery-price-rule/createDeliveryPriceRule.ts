import type { CreateDeliveryPriceRuleDTO } from '@core/entities/deliveryPriceRule'
import type { DeliveryPriceRuleGateway } from '@core/gateways/deliveryPriceRuleGateway'
import { useDeliveryPriceRuleStore } from '@store/deliveryPriceRuleStore'

export const createDeliveryPriceRule = async (
  dto: CreateDeliveryPriceRuleDTO,
  gateway: DeliveryPriceRuleGateway
) => {
  const created = await gateway.create(dto)
  const store = useDeliveryPriceRuleStore()
  store.add(created)
}
