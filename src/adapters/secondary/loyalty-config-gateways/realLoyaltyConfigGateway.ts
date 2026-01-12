import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import type { LoyaltyConfig } from '@core/entities/loyaltyConfig'
import type {
  LoyaltyConfigGateway,
  UpdateLoyaltyConfigDTO
} from '@core/gateways/loyaltyConfigGateway'

export class RealLoyaltyConfigGateway
  extends RealGateway
  implements LoyaltyConfigGateway
{
  constructor(url: string) {
    super(url)
  }

  async get(): Promise<LoyaltyConfig> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/loyalty-config`)
    return this.convertToLoyaltyConfig(res.data.item)
  }

  async update(dto: UpdateLoyaltyConfigDTO): Promise<LoyaltyConfig> {
    const res = await axiosWithBearer.put(`${this.baseUrl}/loyalty-config`, dto)
    return this.convertToLoyaltyConfig(res.data.item)
  }

  private convertToLoyaltyConfig(data: any): LoyaltyConfig {
    return {
      pointsPerEuro: data.pointsPerEuro,
      isEnabled: data.isEnabled
    }
  }
}
