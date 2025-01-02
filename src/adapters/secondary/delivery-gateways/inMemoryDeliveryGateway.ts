import { DeliveryGateway } from '@core/gateways/deliveryGateway'
import { Delivery } from '@core/entities/delivery'
import { UUID } from '@core/types/types'

export class InMemoryDeliveryGateway implements DeliveryGateway {
  private deliveries: Array<Delivery> = []
  private printed: Array<UUID> = []

  list(): Promise<Array<Delivery>> {
    return Promise.resolve(this.deliveries)
  }

  printLabel(uuid: UUID): Promise<void> {
    this.printed.push(uuid)
    return Promise.resolve()
  }

  listPrinted(): Array<UUID> {
    return this.printed
  }

  feedWith(...deliveries: Array<Delivery>) {
    this.deliveries = deliveries
  }
}
