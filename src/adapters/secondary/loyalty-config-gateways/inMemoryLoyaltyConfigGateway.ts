import type { LoyaltyConfig } from '@core/entities/loyaltyConfig'
import type {
  LoyaltyConfigGateway,
  UpdateLoyaltyConfigDTO
} from '@core/gateways/loyaltyConfigGateway'

export class InMemoryLoyaltyConfigGateway implements LoyaltyConfigGateway {
  private config: LoyaltyConfig = {
    pointsPerEuro: 1,
    isEnabled: false
  }

  async get(): Promise<LoyaltyConfig> {
    return Promise.resolve(JSON.parse(JSON.stringify(this.config)))
  }

  async update(dto: UpdateLoyaltyConfigDTO): Promise<LoyaltyConfig> {
    this.config = {
      pointsPerEuro: dto.pointsPerEuro,
      isEnabled: dto.isEnabled
    }
    return Promise.resolve(JSON.parse(JSON.stringify(this.config)))
  }

  feedWith(config: LoyaltyConfig) {
    this.config = JSON.parse(JSON.stringify(config))
  }
}
