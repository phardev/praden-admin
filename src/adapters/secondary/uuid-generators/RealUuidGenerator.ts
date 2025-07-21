import { UuidGenerator } from '@core/gateways/uuidGenerator'

export class RealUuidGenerator implements UuidGenerator {
  generate(): string {
    return crypto.randomUUID()
  }
}
