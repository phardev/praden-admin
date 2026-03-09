import type {
  LoyaltyConfig,
  MultiplierPeriod
} from '@core/entities/loyaltyConfig'
import type {
  CustomerLoyalty,
  LoyaltyPointsTransaction
} from '@core/entities/loyaltyPointsTransaction'
import { LoyaltyTransactionType } from '@core/entities/loyaltyPointsTransaction'
import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import type { UuidGenerator } from '@core/gateways/uuidGenerator'
import type { UUID } from '@core/types/types'

export class InMemoryLoyaltyGateway implements LoyaltyGateway {
  private loyaltyByCustomer: Map<UUID, CustomerLoyalty> = new Map()
  private config: LoyaltyConfig = { earningRate: 1, multipliers: [] }
  private uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
  }

  getCustomerLoyalty(customerUuid: UUID): Promise<CustomerLoyalty> {
    const loyalty = this.loyaltyByCustomer.get(customerUuid)
    if (!loyalty) {
      return Promise.resolve({ balance: 0, transactions: [] })
    }
    return Promise.resolve(JSON.parse(JSON.stringify(loyalty)))
  }

  creditManualPoints(
    customerUuid: UUID,
    points: number,
    reason: string
  ): Promise<LoyaltyPointsTransaction> {
    const transaction: LoyaltyPointsTransaction = {
      uuid: this.uuidGenerator.generate(),
      customerUuid,
      type: LoyaltyTransactionType.ManualCredit,
      points,
      reason,
      earnedAt: 1700000000000,
      expiresAt: 1731536000000,
      createdAt: 1700000000000,
      createdBy: 'admin'
    }
    const existing = this.loyaltyByCustomer.get(customerUuid)
    if (existing) {
      existing.transactions.push(transaction)
      existing.balance += points
    } else {
      this.loyaltyByCustomer.set(customerUuid, {
        balance: points,
        transactions: [transaction]
      })
    }
    return Promise.resolve(JSON.parse(JSON.stringify(transaction)))
  }

  getConfig(): Promise<LoyaltyConfig> {
    return Promise.resolve(JSON.parse(JSON.stringify(this.config)))
  }

  saveConfig(earningRate: number): Promise<LoyaltyConfig> {
    this.config = { ...this.config, earningRate }
    return Promise.resolve(JSON.parse(JSON.stringify(this.config)))
  }

  createMultiplier(
    startDate: number,
    endDate: number,
    multiplier: number
  ): Promise<MultiplierPeriod> {
    const period: MultiplierPeriod = {
      uuid: this.uuidGenerator.generate(),
      startDate,
      endDate,
      multiplier,
      createdAt: 1700000000000,
      createdBy: 'admin',
      updatedAt: 1700000000000,
      updatedBy: 'admin'
    }
    this.config.multipliers.push(period)
    return Promise.resolve(JSON.parse(JSON.stringify(period)))
  }

  deleteMultiplier(uuid: UUID): Promise<void> {
    const index = this.config.multipliers.findIndex((m) => m.uuid === uuid)
    if (index < 0) {
      return Promise.reject(new Error(`Multiplier ${uuid} not found`))
    }
    this.config.multipliers.splice(index, 1)
    return Promise.resolve()
  }

  feedWithCustomerLoyalty(customerUuid: UUID, loyalty: CustomerLoyalty): void {
    this.loyaltyByCustomer.set(
      customerUuid,
      JSON.parse(JSON.stringify(loyalty))
    )
  }

  feedWithConfig(config: LoyaltyConfig): void {
    this.config = JSON.parse(JSON.stringify(config))
  }
}
