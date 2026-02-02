import type { CustomerLoyaltyBalance } from '@core/entities/loyaltyTransaction'
import type { UUID } from '@core/types/types'

export interface LoyaltyGateway {
  getCustomerLoyalty(customerUuid: UUID): Promise<CustomerLoyaltyBalance>
  creditPoints(
    customerUuid: UUID,
    points: number,
    reason: string
  ): Promise<void>
}
