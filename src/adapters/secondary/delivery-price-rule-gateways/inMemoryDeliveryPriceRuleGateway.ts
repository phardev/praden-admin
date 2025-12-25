import type {
  CreateDeliveryPriceRuleDTO,
  DeliveryPriceRule,
  EditDeliveryPriceRuleDTO
} from '@core/entities/deliveryPriceRule'
import { DeliveryPriceRuleDoesNotExistsError } from '@core/errors/DeliveryPriceRuleDoesNotExistsError'
import type { DateProvider } from '@core/gateways/dateProvider'
import type { DeliveryPriceRuleGateway } from '@core/gateways/deliveryPriceRuleGateway'
import type { UuidGenerator } from '@core/gateways/uuidGenerator'
import type { UUID } from '@core/types/types'

export class InMemoryDeliveryPriceRuleGateway
  implements DeliveryPriceRuleGateway
{
  private rules: Array<DeliveryPriceRule> = []
  private currentUserUuid: UUID = 'test-user-uuid'

  constructor(
    private uuidGenerator: UuidGenerator,
    private dateProvider: DateProvider
  ) {}

  feedWith(...rules: Array<DeliveryPriceRule>): void {
    this.rules = JSON.parse(JSON.stringify(rules))
  }

  setCurrentUser(uuid: UUID): void {
    this.currentUserUuid = uuid
  }

  async list(): Promise<Array<DeliveryPriceRule>> {
    const sorted = [...this.rules].sort((a, b) => b.priority - a.priority)
    return Promise.resolve(JSON.parse(JSON.stringify(sorted)))
  }

  async listByDeliveryMethod(
    deliveryMethodUuid: UUID
  ): Promise<Array<DeliveryPriceRule>> {
    const filtered = this.rules
      .filter((rule) => rule.deliveryMethodUuid === deliveryMethodUuid)
      .sort((a, b) => b.priority - a.priority)
    return Promise.resolve(JSON.parse(JSON.stringify(filtered)))
  }

  async getByUuid(uuid: UUID): Promise<DeliveryPriceRule> {
    const rule = this.rules.find((r) => r.uuid === uuid)
    if (!rule) throw new DeliveryPriceRuleDoesNotExistsError(uuid)
    return Promise.resolve(JSON.parse(JSON.stringify(rule)))
  }

  async create(dto: CreateDeliveryPriceRuleDTO): Promise<DeliveryPriceRule> {
    const now = this.dateProvider.now()
    const rule: DeliveryPriceRule = {
      uuid: this.uuidGenerator.generate(),
      deliveryMethodUuid: dto.deliveryMethodUuid,
      name: dto.name,
      price: dto.price,
      minOrderValue: dto.minOrderValue,
      maxWeight: dto.maxWeight,
      priority: dto.priority,
      startDate: dto.startDate,
      endDate: dto.endDate,
      isActive: dto.isActive,
      createdAt: now,
      createdBy: this.currentUserUuid,
      updatedAt: now,
      updatedBy: this.currentUserUuid
    }
    this.rules.push(rule)
    return Promise.resolve(JSON.parse(JSON.stringify(rule)))
  }

  async edit(
    uuid: UUID,
    dto: EditDeliveryPriceRuleDTO
  ): Promise<DeliveryPriceRule> {
    const index = this.rules.findIndex((r) => r.uuid === uuid)
    if (index === -1) throw new DeliveryPriceRuleDoesNotExistsError(uuid)

    const now = this.dateProvider.now()
    this.rules[index] = {
      ...this.rules[index],
      ...dto,
      updatedAt: now,
      updatedBy: this.currentUserUuid
    }
    return Promise.resolve(JSON.parse(JSON.stringify(this.rules[index])))
  }

  async delete(uuid: UUID): Promise<void> {
    const index = this.rules.findIndex((r) => r.uuid === uuid)
    if (index === -1) throw new DeliveryPriceRuleDoesNotExistsError(uuid)
    this.rules.splice(index, 1)
    return Promise.resolve()
  }
}
