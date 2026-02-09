import type { LoyaltyPointsConfig } from '@core/entities/loyaltyPointsConfig'
import type { LoyaltyPointsMultiplier } from '@core/entities/loyaltyPointsMultiplier'
import type { LoyaltyPointsTransaction } from '@core/entities/loyaltyPointsTransaction'
import type { UUID } from '@core/types/types'

export interface SaveConfigDTO {
  pointsPerEuro: number
}

export interface CreateMultiplierDTO {
  startDate: string
  endDate: string
  multiplier: number
}

export interface CreditPointsDTO {
  points: number
  reason: string
}

export interface LoyaltyGateway {
  getConfig(): Promise<LoyaltyPointsConfig | null>
  saveConfig(dto: SaveConfigDTO): Promise<LoyaltyPointsConfig>
  getMultipliers(): Promise<Array<LoyaltyPointsMultiplier>>
  createMultiplier(dto: CreateMultiplierDTO): Promise<LoyaltyPointsMultiplier>
  deleteMultiplier(uuid: UUID): Promise<void>
  creditPoints(
    customerUuid: UUID,
    dto: CreditPointsDTO
  ): Promise<LoyaltyPointsTransaction>
}
