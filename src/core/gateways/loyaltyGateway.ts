import type {
  CreateMultiplierDTO,
  CustomerLoyaltyPoints,
  EditMultiplierDTO,
  LoyaltyConfig,
  LoyaltyPointsMultiplier
} from '@core/entities/loyalty'
import type { UUID } from '@core/types/types'

export interface LoyaltyGateway {
  getConfig(): Promise<LoyaltyConfig | null>
  updateConfig(config: LoyaltyConfig): Promise<void>

  getCustomerPoints(customerUuid: UUID): Promise<CustomerLoyaltyPoints>
  creditPoints(
    customerUuid: UUID,
    points: number,
    reason: string
  ): Promise<void>

  listMultipliers(): Promise<LoyaltyPointsMultiplier[]>
  createMultiplier(multiplier: CreateMultiplierDTO): Promise<void>
  editMultiplier(uuid: UUID, multiplier: EditMultiplierDTO): Promise<void>
  deleteMultiplier(uuid: UUID): Promise<void>
}
