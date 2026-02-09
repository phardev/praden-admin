import type { LoyaltyPointsConfig } from '@core/entities/loyaltyPointsConfig'
import type { LoyaltyPointsMultiplier } from '@core/entities/loyaltyPointsMultiplier'
import type { LoyaltyPointsTransaction } from '@core/entities/loyaltyPointsTransaction'
import type {
  CreateMultiplierDTO,
  CreditPointsDTO,
  LoyaltyGateway,
  SaveConfigDTO
} from '@core/gateways/loyaltyGateway'
import type { UuidGenerator } from '@core/gateways/uuidGenerator'
import type { UUID } from '@core/types/types'

export class InMemoryLoyaltyGateway implements LoyaltyGateway {
  private config: LoyaltyPointsConfig | null = null
  private multipliers: Array<LoyaltyPointsMultiplier> = []
  private transactions: Array<LoyaltyPointsTransaction> = []
  private readonly uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
  }

  getConfig(): Promise<LoyaltyPointsConfig | null> {
    return Promise.resolve(
      this.config ? JSON.parse(JSON.stringify(this.config)) : null
    )
  }

  saveConfig(dto: SaveConfigDTO): Promise<LoyaltyPointsConfig> {
    const config: LoyaltyPointsConfig = {
      uuid: this.config?.uuid ?? this.uuidGenerator.generate(),
      pointsPerEuro: dto.pointsPerEuro,
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
    this.config = config
    return Promise.resolve(JSON.parse(JSON.stringify(config)))
  }

  getMultipliers(): Promise<Array<LoyaltyPointsMultiplier>> {
    return Promise.resolve(JSON.parse(JSON.stringify(this.multipliers)))
  }

  createMultiplier(dto: CreateMultiplierDTO): Promise<LoyaltyPointsMultiplier> {
    const multiplier: LoyaltyPointsMultiplier = {
      uuid: this.uuidGenerator.generate(),
      startDate: dto.startDate,
      endDate: dto.endDate,
      multiplier: dto.multiplier,
      createdAt: '2024-01-01T00:00:00.000Z'
    }
    this.multipliers.push(multiplier)
    return Promise.resolve(JSON.parse(JSON.stringify(multiplier)))
  }

  deleteMultiplier(uuid: UUID): Promise<void> {
    this.multipliers = this.multipliers.filter((m) => m.uuid !== uuid)
    return Promise.resolve()
  }

  creditPoints(
    customerUuid: UUID,
    dto: CreditPointsDTO
  ): Promise<LoyaltyPointsTransaction> {
    const transaction: LoyaltyPointsTransaction = {
      uuid: this.uuidGenerator.generate(),
      type: 'MANUAL_CREDIT',
      points: dto.points,
      reason: dto.reason,
      createdAt: '2024-01-01T00:00:00.000Z'
    }
    this.transactions.push(transaction)
    return Promise.resolve(JSON.parse(JSON.stringify(transaction)))
  }

  feedWithConfig(config: LoyaltyPointsConfig) {
    this.config = config
  }

  feedWithMultipliers(...multipliers: Array<LoyaltyPointsMultiplier>) {
    this.multipliers = multipliers
  }

  feedWithTransactions(...transactions: Array<LoyaltyPointsTransaction>) {
    this.transactions = transactions
  }

  getStoredMultipliers(): Array<LoyaltyPointsMultiplier> {
    return JSON.parse(JSON.stringify(this.multipliers))
  }
}
