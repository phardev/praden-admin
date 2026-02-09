import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import type { LoyaltyPointsConfig } from '@core/entities/loyaltyPointsConfig'
import type { LoyaltyPointsMultiplier } from '@core/entities/loyaltyPointsMultiplier'
import type { LoyaltyPointsTransaction } from '@core/entities/loyaltyPointsTransaction'
import type {
  CreateMultiplierDTO,
  CreditPointsDTO,
  LoyaltyGateway,
  SaveConfigDTO
} from '@core/gateways/loyaltyGateway'
import type { UUID } from '@core/types/types'
import { RealGateway } from '../order-gateways/RealOrderGateway'

export class RealLoyaltyGateway extends RealGateway implements LoyaltyGateway {
  constructor(url: string) {
    super(url)
  }

  async getConfig(): Promise<LoyaltyPointsConfig | null> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/loyalty/config`)
    return res.data
  }

  async saveConfig(dto: SaveConfigDTO): Promise<LoyaltyPointsConfig> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/loyalty/config`,
      dto
    )
    return res.data
  }

  async getMultipliers(): Promise<Array<LoyaltyPointsMultiplier>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/loyalty/multipliers`)
    return res.data.items
  }

  async createMultiplier(
    dto: CreateMultiplierDTO
  ): Promise<LoyaltyPointsMultiplier> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/loyalty/multipliers`,
      dto
    )
    return res.data
  }

  async deleteMultiplier(uuid: UUID): Promise<void> {
    await axiosWithBearer.delete(`${this.baseUrl}/loyalty/multipliers/${uuid}`)
  }

  async creditPoints(
    customerUuid: UUID,
    dto: CreditPointsDTO
  ): Promise<LoyaltyPointsTransaction> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/customers/${customerUuid}/loyalty/credit`,
      dto
    )
    return res.data
  }
}
