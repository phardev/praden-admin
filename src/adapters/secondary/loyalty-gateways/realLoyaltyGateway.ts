import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import type {
  LoyaltyConfig,
  MultiplierPeriod
} from '@core/entities/loyaltyConfig'
import type {
  CustomerLoyalty,
  LoyaltyPointsTransaction
} from '@core/entities/loyaltyPointsTransaction'
import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import type { UUID } from '@core/types/types'

export class RealLoyaltyGateway extends RealGateway implements LoyaltyGateway {
  constructor(url: string) {
    super(url)
  }

  async getCustomerLoyalty(customerUuid: UUID): Promise<CustomerLoyalty> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/loyalty/customers/${customerUuid}`
    )
    return res.data
  }

  async creditManualPoints(
    customerUuid: UUID,
    points: number,
    reason: string
  ): Promise<LoyaltyPointsTransaction> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/loyalty/customers/${customerUuid}/credit`,
      { points, reason }
    )
    return res.data
  }

  async getConfig(): Promise<LoyaltyConfig> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/loyalty/config`)
    return res.data
  }

  async saveConfig(earningRate: number): Promise<LoyaltyConfig> {
    const res = await axiosWithBearer.post(`${this.baseUrl}/loyalty/config`, {
      earningRate
    })
    return res.data
  }

  async createMultiplier(
    startDate: number,
    endDate: number,
    multiplier: number
  ): Promise<MultiplierPeriod> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/loyalty/multipliers`,
      { startDate, endDate, multiplier }
    )
    return res.data
  }

  async deleteMultiplier(uuid: UUID): Promise<void> {
    await axiosWithBearer.delete(`${this.baseUrl}/loyalty/multipliers/${uuid}`)
  }
}
