import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import type {
  CreateDeliveryPriceRuleDTO,
  DeliveryPriceRule,
  EditDeliveryPriceRuleDTO
} from '@core/entities/deliveryPriceRule'
import type { DeliveryPriceRuleGateway } from '@core/gateways/deliveryPriceRuleGateway'
import type { UUID } from '@core/types/types'

export class RealDeliveryPriceRuleGateway
  extends RealGateway
  implements DeliveryPriceRuleGateway
{
  constructor(url: string) {
    super(url)
  }

  async list(): Promise<Array<DeliveryPriceRule>> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/delivery-price-rules`
    )
    return res.data.items.map(this.convertToDeliveryPriceRule)
  }

  async listByDeliveryMethod(
    deliveryMethodUuid: UUID
  ): Promise<Array<DeliveryPriceRule>> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/delivery-price-rules`,
      {
        params: { deliveryMethodUuid }
      }
    )
    return res.data.items.map(this.convertToDeliveryPriceRule)
  }

  async getByUuid(uuid: UUID): Promise<DeliveryPriceRule> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/delivery-price-rules/${uuid}`
    )
    return this.convertToDeliveryPriceRule(res.data.item)
  }

  async create(dto: CreateDeliveryPriceRuleDTO): Promise<DeliveryPriceRule> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/delivery-price-rules`,
      dto
    )
    return this.convertToDeliveryPriceRule(res.data.item)
  }

  async edit(
    uuid: UUID,
    dto: EditDeliveryPriceRuleDTO
  ): Promise<DeliveryPriceRule> {
    const res = await axiosWithBearer.put(
      `${this.baseUrl}/delivery-price-rules/${uuid}`,
      dto
    )
    return this.convertToDeliveryPriceRule(res.data.item)
  }

  async delete(uuid: UUID): Promise<void> {
    await axiosWithBearer.delete(`${this.baseUrl}/delivery-price-rules/${uuid}`)
  }

  private convertToDeliveryPriceRule(data: any): DeliveryPriceRule {
    return {
      uuid: data.uuid,
      deliveryMethodUuid: data.deliveryMethodUuid,
      name: data.name,
      price: data.price,
      minOrderValue: data.minOrderValue,
      maxWeight: data.maxWeight,
      priority: data.priority,
      startDate: data.startDate,
      endDate: data.endDate,
      isActive: data.isActive,
      createdAt: data.createdAt,
      createdBy: data.createdBy,
      updatedAt: data.updatedAt,
      updatedBy: data.updatedBy
    }
  }
}
