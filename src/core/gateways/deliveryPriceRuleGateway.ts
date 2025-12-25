import type {
  CreateDeliveryPriceRuleDTO,
  DeliveryPriceRule,
  EditDeliveryPriceRuleDTO
} from '@core/entities/deliveryPriceRule'
import type { UUID } from '@core/types/types'

export interface DeliveryPriceRuleGateway {
  list(): Promise<Array<DeliveryPriceRule>>
  listByDeliveryMethod(
    deliveryMethodUuid: UUID
  ): Promise<Array<DeliveryPriceRule>>
  getByUuid(uuid: UUID): Promise<DeliveryPriceRule>
  create(dto: CreateDeliveryPriceRuleDTO): Promise<DeliveryPriceRule>
  edit(uuid: UUID, dto: EditDeliveryPriceRuleDTO): Promise<DeliveryPriceRule>
  delete(uuid: UUID): Promise<void>
}
