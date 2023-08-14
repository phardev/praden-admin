import { UuidGenerator } from '@core/gateways/uuidGenerator'

export class FakeUuidGenerator implements UuidGenerator {
  private next = ''

  generate(): string {
    return this.next
  }

  setNext(next: string) {
    this.next = next
  }
}
