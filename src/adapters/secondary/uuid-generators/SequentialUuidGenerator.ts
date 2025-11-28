import { UuidGenerator } from '@core/gateways/uuidGenerator'

export class SequentialUuidGenerator implements UuidGenerator {
  private counter = 0
  private prefix: string

  constructor(prefix = 'uuid') {
    this.prefix = prefix
  }

  generate(): string {
    return `${this.prefix}-${this.counter++}`
  }

  reset(): void {
    this.counter = 0
  }
}
