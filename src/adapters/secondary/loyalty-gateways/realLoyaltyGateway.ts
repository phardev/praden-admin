import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import type { LoyaltyConfig } from '@core/entities/loyalty/loyaltyConfig'
import type { MultiplierRule } from '@core/entities/loyalty/multiplierRule'
import type { PointsTransaction } from '@core/entities/loyalty/pointsTransaction'
import type {
  CreateMultiplierRuleDTO,
  EditMultiplierRuleDTO,
  LoyaltyGateway
} from '@core/gateways/loyaltyGateway'
import type { UUID } from '@core/types/types'
import { RealGateway } from '../order-gateways/RealOrderGateway'

export class RealLoyaltyGateway extends RealGateway implements LoyaltyGateway {
  constructor(url: string) {
    super(url)
  }

  async getConfig(): Promise<{
    config: LoyaltyConfig
    rules: Array<MultiplierRule>
  }> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/loyalty/config`)
    return res.data
  }

  async updateConfig(pointsPerEuro: number): Promise<LoyaltyConfig> {
    const res = await axiosWithBearer.put(`${this.baseUrl}/loyalty/config`, {
      pointsPerEuro
    })
    return res.data
  }

  async createMultiplierRule(
    dto: CreateMultiplierRuleDTO
  ): Promise<MultiplierRule> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/loyalty/multiplier-rules`,
      dto
    )
    return res.data
  }

  async editMultiplierRule(
    uuid: UUID,
    dto: EditMultiplierRuleDTO
  ): Promise<MultiplierRule> {
    const res = await axiosWithBearer.put(
      `${this.baseUrl}/loyalty/multiplier-rules/${uuid}`,
      dto
    )
    return res.data
  }

  async deleteMultiplierRule(uuid: UUID): Promise<void> {
    await axiosWithBearer.delete(
      `${this.baseUrl}/loyalty/multiplier-rules/${uuid}`
    )
  }

  async getCustomerLoyalty(customerUuid: UUID): Promise<{
    pointsBalance: number
    transactions: Array<PointsTransaction>
  }> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/customers/${customerUuid}`
    )
    return res.data.loyalty
  }

  async creditPoints(
    customerUuid: UUID,
    points: number,
    description?: string
  ): Promise<PointsTransaction> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/customers/${customerUuid}/credit-points`,
      { points, description }
    )
    return res.data
  }
}
