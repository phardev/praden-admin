import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { LoyaltyPointsConfig } from '@core/entities/loyaltyPointsConfig'
import { CustomerLoyaltyPoints } from '@core/entities/loyaltyTransaction'
import {
  LoyaltyGateway,
  UpdateLoyaltyConfigDTO
} from '@core/gateways/loyaltyGateway'
import { UUID } from '@core/types/types'

export class RealLoyaltyGateway extends RealGateway implements LoyaltyGateway {
  constructor(url: string) {
    super(url)
  }

  async getConfig(): Promise<LoyaltyPointsConfig | null> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/loyalty/config`)
    if (!res.data.item) {
      return null
    }
    return this.convertToConfig(res.data.item)
  }

  async updateConfig(
    dto: UpdateLoyaltyConfigDTO
  ): Promise<LoyaltyPointsConfig> {
    const res = await axiosWithBearer.patch(
      `${this.baseUrl}/loyalty/config`,
      dto
    )
    return this.convertToConfig(res.data.item)
  }

  async getCustomerLoyaltyPoints(
    customerUuid: UUID
  ): Promise<CustomerLoyaltyPoints> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/loyalty/customers/${customerUuid}`
    )
    return this.convertToCustomerLoyalty(res.data.item)
  }

  private convertToConfig(data: any): LoyaltyPointsConfig {
    return {
      pointsPerEuro: data.pointsPerEuro,
      isActive: data.isActive,
      updatedAt: data.updatedAt,
      updatedBy: data.updatedBy
    }
  }

  private convertToCustomerLoyalty(data: any): CustomerLoyaltyPoints {
    return {
      totalPoints: data.totalPoints,
      activePoints: data.activePoints,
      transactions: data.transactions.map((t: any) => ({
        uuid: t.uuid,
        orderUuid: t.orderUuid,
        points: t.points,
        eligibleAmount: t.eligibleAmount,
        earnedAt: t.earnedAt,
        expiresAt: t.expiresAt,
        isExpired: t.isExpired
      }))
    }
  }
}
