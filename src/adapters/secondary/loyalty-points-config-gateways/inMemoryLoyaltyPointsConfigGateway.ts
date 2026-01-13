import { LoyaltyPointsConfig } from '@core/entities/loyaltyPointsConfig'
import {
  LoyaltyPointsConfigGateway,
  UpdateLoyaltyPointsConfigDTO
} from '@core/gateways/loyaltyPointsConfigGateway'
import { UuidGenerator } from '@core/gateways/uuidGenerator'

export class InMemoryLoyaltyPointsConfigGateway
  implements LoyaltyPointsConfigGateway
{
  private config: LoyaltyPointsConfig | null = null
  private uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
  }

  async get(): Promise<LoyaltyPointsConfig | null> {
    return Promise.resolve(
      this.config ? JSON.parse(JSON.stringify(this.config)) : null
    )
  }

  async update(
    dto: UpdateLoyaltyPointsConfigDTO
  ): Promise<LoyaltyPointsConfig> {
    const updatedConfig: LoyaltyPointsConfig = {
      uuid: this.config?.uuid ?? this.uuidGenerator.generate(),
      pointsPerEuro: dto.pointsPerEuro,
      minimumOrderAmount: dto.minimumOrderAmount,
      isActive: dto.isActive
    }
    this.config = updatedConfig
    return Promise.resolve(JSON.parse(JSON.stringify(updatedConfig)))
  }

  feedWith(config: LoyaltyPointsConfig | null) {
    this.config = config ? JSON.parse(JSON.stringify(config)) : null
  }
}
