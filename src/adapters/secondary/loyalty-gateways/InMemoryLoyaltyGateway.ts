import type {
  CreateMultiplierDTO,
  CustomerLoyaltyPoints,
  EditMultiplierDTO,
  LoyaltyConfig,
  LoyaltyPointsMultiplier,
  LoyaltyPointsTransaction
} from '@core/entities/loyalty'
import { LoyaltyTransactionType } from '@core/entities/loyalty'
import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import type { UuidGenerator } from '@core/gateways/uuidGenerator'
import type { UUID } from '@core/types/types'

export class InMemoryLoyaltyGateway implements LoyaltyGateway {
  private config: LoyaltyConfig | null = null
  private customerPoints: Map<UUID, CustomerLoyaltyPoints> = new Map()
  private multipliers: LoyaltyPointsMultiplier[] = []
  private uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
  }

  getConfig(): Promise<LoyaltyConfig | null> {
    return Promise.resolve(
      this.config ? JSON.parse(JSON.stringify(this.config)) : null
    )
  }

  updateConfig(config: LoyaltyConfig): Promise<void> {
    this.config = { ...config }
    return Promise.resolve()
  }

  getCustomerPoints(customerUuid: UUID): Promise<CustomerLoyaltyPoints> {
    const points = this.customerPoints.get(customerUuid)
    if (!points) {
      return Promise.resolve({ balance: 0, transactions: [] })
    }
    return Promise.resolve(JSON.parse(JSON.stringify(points)))
  }

  creditPoints(
    customerUuid: UUID,
    points: number,
    reason: string
  ): Promise<void> {
    const existing = this.customerPoints.get(customerUuid) || {
      balance: 0,
      transactions: []
    }
    const transaction: LoyaltyPointsTransaction = {
      uuid: this.uuidGenerator.generate(),
      customerUuid,
      type: LoyaltyTransactionType.ManualCredit,
      points,
      reason,
      createdAt: Date.now()
    }
    existing.balance += points
    existing.transactions.push(transaction)
    this.customerPoints.set(customerUuid, existing)
    return Promise.resolve()
  }

  listMultipliers(): Promise<LoyaltyPointsMultiplier[]> {
    return Promise.resolve(JSON.parse(JSON.stringify(this.multipliers)))
  }

  createMultiplier(multiplier: CreateMultiplierDTO): Promise<void> {
    const newMultiplier: LoyaltyPointsMultiplier = {
      ...multiplier,
      uuid: this.uuidGenerator.generate(),
      isActive: true,
      createdAt: Date.now()
    }
    this.multipliers.push(newMultiplier)
    return Promise.resolve()
  }

  editMultiplier(uuid: UUID, multiplier: EditMultiplierDTO): Promise<void> {
    const index = this.multipliers.findIndex((m) => m.uuid === uuid)
    if (index >= 0) {
      this.multipliers[index] = {
        ...this.multipliers[index],
        ...multiplier
      }
    }
    return Promise.resolve()
  }

  deleteMultiplier(uuid: UUID): Promise<void> {
    this.multipliers = this.multipliers.filter((m) => m.uuid !== uuid)
    return Promise.resolve()
  }

  feedConfig(config: LoyaltyConfig) {
    this.config = config
  }

  feedCustomerPoints(customerUuid: UUID, points: CustomerLoyaltyPoints) {
    this.customerPoints.set(customerUuid, points)
  }

  feedMultipliers(...multipliers: LoyaltyPointsMultiplier[]) {
    this.multipliers = [...multipliers]
  }
}
