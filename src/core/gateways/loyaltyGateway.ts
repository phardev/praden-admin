import type { LoyaltyConfig } from '@core/entities/loyalty/loyaltyConfig'
import type { MultiplierRule } from '@core/entities/loyalty/multiplierRule'
import type { PointsTransaction } from '@core/entities/loyalty/pointsTransaction'
import type { UUID } from '@core/types/types'

export interface CreateMultiplierRuleDTO {
  multiplier: number
  startDate: number
  endDate: number
}

export interface EditMultiplierRuleDTO {
  multiplier: number
  startDate: number
  endDate: number
}

export interface LoyaltyGateway {
  getConfig(): Promise<{
    config: LoyaltyConfig
    rules: Array<MultiplierRule>
  }>
  updateConfig(pointsPerEuro: number): Promise<LoyaltyConfig>
  createMultiplierRule(dto: CreateMultiplierRuleDTO): Promise<MultiplierRule>
  editMultiplierRule(
    uuid: UUID,
    dto: EditMultiplierRuleDTO
  ): Promise<MultiplierRule>
  deleteMultiplierRule(uuid: UUID): Promise<void>
  getCustomerLoyalty(customerUuid: UUID): Promise<{
    pointsBalance: number
    transactions: Array<PointsTransaction>
  }>
  creditPoints(
    customerUuid: UUID,
    points: number,
    description?: string
  ): Promise<void>
}
