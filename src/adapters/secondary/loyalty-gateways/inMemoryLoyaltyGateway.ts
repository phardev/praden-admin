import type { LoyaltyConfig } from '@core/entities/loyalty/loyaltyConfig'
import type { MultiplierRule } from '@core/entities/loyalty/multiplierRule'
import type { PointsTransaction } from '@core/entities/loyalty/pointsTransaction'
import type {
  CreateMultiplierRuleDTO,
  EditMultiplierRuleDTO,
  LoyaltyGateway
} from '@core/gateways/loyaltyGateway'
import type { UuidGenerator } from '@core/gateways/uuidGenerator'
import type { UUID } from '@core/types/types'

export class InMemoryLoyaltyGateway implements LoyaltyGateway {
  private config: LoyaltyConfig = { pointsPerEuro: 0 }
  private rules: Array<MultiplierRule> = []
  private transactions: Array<PointsTransaction> = []
  private uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
  }

  getConfig(): Promise<{
    config: LoyaltyConfig
    rules: Array<MultiplierRule>
  }> {
    return Promise.resolve({
      config: JSON.parse(JSON.stringify(this.config)),
      rules: JSON.parse(JSON.stringify(this.rules))
    })
  }

  updateConfig(pointsPerEuro: number): Promise<LoyaltyConfig> {
    this.config = { pointsPerEuro }
    return Promise.resolve(JSON.parse(JSON.stringify(this.config)))
  }

  createMultiplierRule(dto: CreateMultiplierRuleDTO): Promise<MultiplierRule> {
    const now = new Date().toISOString()
    const rule: MultiplierRule = {
      uuid: this.uuidGenerator.generate(),
      multiplier: dto.multiplier,
      startDate: dto.startDate,
      endDate: dto.endDate,
      createdAt: now,
      updatedAt: now
    }
    this.rules.push(rule)
    return Promise.resolve(JSON.parse(JSON.stringify(rule)))
  }

  editMultiplierRule(
    uuid: UUID,
    dto: EditMultiplierRuleDTO
  ): Promise<MultiplierRule> {
    const index = this.rules.findIndex((r) => r.uuid === uuid)
    if (index < 0) throw new Error(`MultiplierRule ${uuid} not found`)
    this.rules[index] = {
      ...this.rules[index],
      multiplier: dto.multiplier,
      startDate: dto.startDate,
      endDate: dto.endDate,
      updatedAt: new Date().toISOString()
    }
    return Promise.resolve(JSON.parse(JSON.stringify(this.rules[index])))
  }

  deleteMultiplierRule(uuid: UUID): Promise<void> {
    const index = this.rules.findIndex((r) => r.uuid === uuid)
    if (index < 0) throw new Error(`MultiplierRule ${uuid} not found`)
    this.rules.splice(index, 1)
    return Promise.resolve()
  }

  getCustomerLoyalty(customerUuid: UUID): Promise<{
    pointsBalance: number
    transactions: Array<PointsTransaction>
  }> {
    const customerTransactions = this.transactions.filter(
      (t) => t.customerUuid === customerUuid
    )
    const pointsBalance = customerTransactions.reduce(
      (sum, t) => sum + t.points,
      0
    )
    return Promise.resolve({
      pointsBalance,
      transactions: JSON.parse(JSON.stringify(customerTransactions))
    })
  }

  creditPoints(
    customerUuid: UUID,
    points: number,
    description?: string
  ): Promise<void> {
    const transaction: PointsTransaction = {
      uuid: this.uuidGenerator.generate(),
      customerUuid,
      type: 'MANUAL_CREDIT',
      points,
      description,
      createdAt: new Date().toISOString()
    }
    this.transactions.push(transaction)
    return Promise.resolve()
  }

  feedWithConfig(config: LoyaltyConfig): void {
    this.config = JSON.parse(JSON.stringify(config))
  }

  feedWithRules(...rules: Array<MultiplierRule>): void {
    this.rules = JSON.parse(JSON.stringify(rules))
  }

  feedWithTransactions(...transactions: Array<PointsTransaction>): void {
    this.transactions = JSON.parse(JSON.stringify(transactions))
  }

  getRules(): Array<MultiplierRule> {
    return JSON.parse(JSON.stringify(this.rules))
  }

  getTransactions(): Array<PointsTransaction> {
    return JSON.parse(JSON.stringify(this.transactions))
  }
}
