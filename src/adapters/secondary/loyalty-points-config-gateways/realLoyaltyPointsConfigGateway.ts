import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { LoyaltyPointsConfig } from '@core/entities/loyaltyPointsConfig'
import {
  LoyaltyPointsConfigGateway,
  UpdateLoyaltyPointsConfigDTO
} from '@core/gateways/loyaltyPointsConfigGateway'

export class RealLoyaltyPointsConfigGateway
  extends RealGateway
  implements LoyaltyPointsConfigGateway
{
  constructor(url: string) {
    super(url)
  }

  async get(): Promise<LoyaltyPointsConfig | null> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/loyalty-points-config`
    )
    if (!res.data) {
      return null
    }
    return this.convertToLoyaltyPointsConfig(res.data)
  }

  async update(
    dto: UpdateLoyaltyPointsConfigDTO
  ): Promise<LoyaltyPointsConfig> {
    const res = await axiosWithBearer.put(
      `${this.baseUrl}/loyalty-points-config`,
      dto
    )
    return this.convertToLoyaltyPointsConfig(res.data)
  }

  private convertToLoyaltyPointsConfig(data: any): LoyaltyPointsConfig {
    return {
      uuid: data.uuid,
      pointsPerEuro: data.pointsPerEuro,
      minimumOrderAmount: data.minimumOrderAmount,
      isActive: data.isActive
    }
  }
}
