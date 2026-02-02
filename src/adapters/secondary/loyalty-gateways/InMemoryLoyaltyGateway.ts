import type {
  CustomerLoyaltyBalance,
  LoyaltyTransaction
} from '@core/entities/loyaltyTransaction'
import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import type { UUID } from '@core/types/types'

export class InMemoryLoyaltyGateway implements LoyaltyGateway {
  private loyaltyBalances: Map<UUID, CustomerLoyaltyBalance> = new Map()

  getCustomerLoyalty(customerUuid: UUID): Promise<CustomerLoyaltyBalance> {
    const balance = this.loyaltyBalances.get(customerUuid)
    if (!balance) {
      return Promise.resolve({
        customerUuid,
        totalPoints: 0,
        expiringPoints: 0,
        expiringDate: undefined,
        transactions: []
      })
    }
    return Promise.resolve(JSON.parse(JSON.stringify(balance)))
  }

  creditPoints(
    customerUuid: UUID,
    points: number,
    reason: string
  ): Promise<void> {
    const existing = this.loyaltyBalances.get(customerUuid)
    if (existing) {
      existing.totalPoints += points
    }
    return Promise.resolve()
  }

  feedWith(customerUuid: UUID, balance: CustomerLoyaltyBalance): void {
    this.loyaltyBalances.set(customerUuid, balance)
  }

  feedWithTransactions(
    customerUuid: UUID,
    transactions: Array<LoyaltyTransaction>,
    totalPoints: number,
    expiringPoints: number = 0,
    expiringDate?: number
  ): void {
    this.loyaltyBalances.set(customerUuid, {
      customerUuid,
      totalPoints,
      expiringPoints,
      expiringDate,
      transactions
    })
  }
}
