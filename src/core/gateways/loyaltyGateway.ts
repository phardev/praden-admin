import type { CustomerLoyalty, LoyaltyConfig } from '@core/entities/loyalty'

export interface LoyaltyGateway {
  getConfig(): Promise<LoyaltyConfig>
  updateConfig(eurosPerPoint: number): Promise<LoyaltyConfig>
  getCustomerLoyalty(customerUuid: string): Promise<CustomerLoyalty>
}
