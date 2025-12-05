import type { EditDeliveryPriceRuleDTO } from '@core/entities/deliveryPriceRule'
import type { DeliveryPriceRuleGateway } from '@core/gateways/deliveryPriceRuleGateway'
import type { UUID } from '@core/types/types'
import { useDeliveryPriceRuleStore } from '@store/deliveryPriceRuleStore'

export const editDeliveryPriceRule = async (
  uuid: UUID,
  dto: EditDeliveryPriceRuleDTO,
  gateway: DeliveryPriceRuleGateway
) => {
  const edited = await gateway.edit(uuid, dto)
  const store = useDeliveryPriceRuleStore()
  store.edit(edited)
}
