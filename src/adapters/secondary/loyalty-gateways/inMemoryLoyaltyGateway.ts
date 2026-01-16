import { LoyaltyPointsConfig } from '@core/entities/loyaltyPointsConfig'
import {
  CustomerLoyaltyPoints,
  LoyaltyTransaction
} from '@core/entities/loyaltyTransaction'
import {
  LoyaltyGateway,
  UpdateLoyaltyConfigDTO
} from '@core/gateways/loyaltyGateway'
import { UUID } from '@core/types/types'

export class InMemoryLoyaltyGateway implements LoyaltyGateway {
  private config: LoyaltyPointsConfig | null = null
  private customerLoyalty: Map<UUID, CustomerLoyaltyPoints> = new Map()

  async getConfig(): Promise<LoyaltyPointsConfig | null> {
    return Promise.resolve(
      this.config ? JSON.parse(JSON.stringify(this.config)) : null
    )
  }

  async updateConfig(
    dto: UpdateLoyaltyConfigDTO
  ): Promise<LoyaltyPointsConfig> {
    if (!this.config) {
      this.config = {
        pointsPerEuro: dto.pointsPerEuro ?? 1,
        isActive: dto.isActive ?? false,
        updatedAt: Date.now(),
        updatedBy: 'test'
      }
    } else {
      if (dto.pointsPerEuro !== undefined) {
        this.config.pointsPerEuro = dto.pointsPerEuro
      }
      if (dto.isActive !== undefined) {
        this.config.isActive = dto.isActive
      }
      this.config.updatedAt = Date.now()
    }
    return Promise.resolve(JSON.parse(JSON.stringify(this.config)))
  }

  async getCustomerLoyaltyPoints(
    customerUuid: UUID
  ): Promise<CustomerLoyaltyPoints> {
    const loyalty = this.customerLoyalty.get(customerUuid)
    if (!loyalty) {
      return Promise.resolve({
        totalPoints: 0,
        activePoints: 0,
        transactions: []
      })
    }
    return Promise.resolve(JSON.parse(JSON.stringify(loyalty)))
  }

  feedWithConfig(config: LoyaltyPointsConfig) {
    this.config = JSON.parse(JSON.stringify(config))
  }

  feedWithCustomerLoyalty(customerUuid: UUID, loyalty: CustomerLoyaltyPoints) {
    this.customerLoyalty.set(customerUuid, JSON.parse(JSON.stringify(loyalty)))
  }

  feedWithTransactions(customerUuid: UUID, transactions: LoyaltyTransaction[]) {
    const totalPoints = transactions.reduce((sum, t) => sum + t.points, 0)
    const activePoints = transactions
      .filter((t) => !t.isExpired)
      .reduce((sum, t) => sum + t.points, 0)
    this.customerLoyalty.set(customerUuid, {
      totalPoints,
      activePoints,
      transactions: JSON.parse(JSON.stringify(transactions))
    })
  }
}
