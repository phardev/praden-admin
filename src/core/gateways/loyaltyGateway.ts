import { LoyaltyPointsConfig } from '@core/entities/loyaltyPointsConfig'
import { CustomerLoyaltyPoints } from '@core/entities/loyaltyTransaction'
import { UUID } from '@core/types/types'

export interface UpdateLoyaltyConfigDTO {
  pointsPerEuro?: number
  isActive?: boolean
}

export interface LoyaltyGateway {
  getConfig(): Promise<LoyaltyPointsConfig | null>
  updateConfig(dto: UpdateLoyaltyConfigDTO): Promise<LoyaltyPointsConfig>
  getCustomerLoyaltyPoints(customerUuid: UUID): Promise<CustomerLoyaltyPoints>
}
