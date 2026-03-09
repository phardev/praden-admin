import type {
  LoyaltyConfig,
  MultiplierPeriod
} from '@core/entities/loyaltyConfig'
import type {
  CustomerLoyalty,
  LoyaltyPointsTransaction
} from '@core/entities/loyaltyPointsTransaction'
import type { UUID } from '@core/types/types'

export interface LoyaltyGateway {
  getCustomerLoyalty(customerUuid: UUID): Promise<CustomerLoyalty>
  creditManualPoints(
    customerUuid: UUID,
    points: number,
    reason: string
  ): Promise<LoyaltyPointsTransaction>
  getConfig(): Promise<LoyaltyConfig>
  saveConfig(earningRate: number): Promise<LoyaltyConfig>
  createMultiplier(
    startDate: number,
    endDate: number,
    multiplier: number
  ): Promise<MultiplierPeriod>
  deleteMultiplier(uuid: UUID): Promise<void>
}
