import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import type { CustomerLoyaltyBalance } from '@core/entities/loyaltyTransaction'
import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import type { UUID } from '@core/types/types'

export class RealLoyaltyGateway extends RealGateway implements LoyaltyGateway {
  constructor(url: string) {
    super(url)
  }

  async getCustomerLoyalty(
    customerUuid: UUID
  ): Promise<CustomerLoyaltyBalance> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/customers/${customerUuid}/loyalty`
    )
    return res.data
  }

  async creditPoints(
    customerUuid: UUID,
    points: number,
    reason: string
  ): Promise<void> {
    await axiosWithBearer.post(
      `${this.baseUrl}/customers/${customerUuid}/loyalty/credit`,
      { points, reason }
    )
  }
}
