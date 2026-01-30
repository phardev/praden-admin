import type { CustomerLoyalty, LoyaltyConfig } from '@core/entities/loyalty'
import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'

export class InMemoryLoyaltyGateway implements LoyaltyGateway {
  private config: LoyaltyConfig | null = null
  private customerLoyaltyMap: Map<string, CustomerLoyalty> = new Map()

  async getConfig(): Promise<LoyaltyConfig> {
    if (!this.config) {
      return {
        eurosPerPoint: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
    return JSON.parse(JSON.stringify(this.config))
  }

  async updateConfig(eurosPerPoint: number): Promise<LoyaltyConfig> {
    const now = new Date().toISOString()
    if (!this.config) {
      this.config = {
        eurosPerPoint,
        createdAt: now,
        updatedAt: now
      }
    } else {
      this.config = {
        ...this.config,
        eurosPerPoint,
        updatedAt: now
      }
    }
    return JSON.parse(JSON.stringify(this.config))
  }

  async getCustomerLoyalty(customerUuid: string): Promise<CustomerLoyalty> {
    const loyalty = this.customerLoyaltyMap.get(customerUuid)
    if (!loyalty) {
      return {
        balance: 0,
        totalEarned: 0,
        transactions: []
      }
    }
    return JSON.parse(JSON.stringify(loyalty))
  }

  feedWithConfig(config: LoyaltyConfig) {
    this.config = JSON.parse(JSON.stringify(config))
  }

  feedWithCustomerLoyalty(customerUuid: string, loyalty: CustomerLoyalty) {
    this.customerLoyaltyMap.set(
      customerUuid,
      JSON.parse(JSON.stringify(loyalty))
    )
  }
}
