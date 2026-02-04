import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import type {
  CreateMultiplierDTO,
  CustomerLoyaltyPoints,
  EditMultiplierDTO,
  LoyaltyConfig,
  LoyaltyPointsMultiplier
} from '@core/entities/loyalty'
import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import type { UUID } from '@core/types/types'

export class RealLoyaltyGateway extends RealGateway implements LoyaltyGateway {
  constructor(baseUrl: string) {
    super(baseUrl)
  }

  async getConfig(): Promise<LoyaltyConfig | null> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/loyalty/config`)
    return res.data
  }

  async updateConfig(config: LoyaltyConfig): Promise<void> {
    await axiosWithBearer.post(`${this.baseUrl}/loyalty/config`, config, {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  async getCustomerPoints(customerUuid: UUID): Promise<CustomerLoyaltyPoints> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/customers/${customerUuid}/loyalty-points`
    )
    return res.data
  }

  async creditPoints(
    customerUuid: UUID,
    points: number,
    reason: string
  ): Promise<void> {
    await axiosWithBearer.post(
      `${this.baseUrl}/customers/${customerUuid}/loyalty-points/credit`,
      { points, reason },
      { headers: { 'Content-Type': 'application/json' } }
    )
  }

  async listMultipliers(): Promise<LoyaltyPointsMultiplier[]> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/loyalty/multipliers`)
    return res.data.items
  }

  async createMultiplier(multiplier: CreateMultiplierDTO): Promise<void> {
    await axiosWithBearer.post(
      `${this.baseUrl}/loyalty/multipliers`,
      multiplier,
      { headers: { 'Content-Type': 'application/json' } }
    )
  }

  async editMultiplier(
    uuid: UUID,
    multiplier: EditMultiplierDTO
  ): Promise<void> {
    await axiosWithBearer.put(
      `${this.baseUrl}/loyalty/multipliers/${uuid}`,
      multiplier,
      { headers: { 'Content-Type': 'application/json' } }
    )
  }

  async deleteMultiplier(uuid: UUID): Promise<void> {
    await axiosWithBearer.delete(`${this.baseUrl}/loyalty/multipliers/${uuid}`)
  }
}
