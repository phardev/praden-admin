import { DeliveryGateway } from '@core/gateways/deliveryGateway'
import { Delivery } from '@core/entities/delivery'

export class InMemoryDeliveryGateway implements DeliveryGateway {
  private deliveries: Array<Delivery> = []

  list(): Promise<Array<Delivery>> {
    return Promise.resolve(this.deliveries)
  }

  feedWith(...deliveries: Array<Delivery>) {
    this.deliveries = deliveries
  }
}
