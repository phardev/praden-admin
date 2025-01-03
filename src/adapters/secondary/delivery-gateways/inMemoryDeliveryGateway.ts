import { DeliveryGateway } from '@core/gateways/deliveryGateway'
import { Delivery, DeliveryStatus } from '@core/entities/delivery'
import { UUID } from '@core/types/types'

export class InMemoryDeliveryGateway implements DeliveryGateway {
  private deliveries: Array<Delivery> = []
  private printed: Array<UUID> = []

  list(): Promise<Array<Delivery>> {
    return Promise.resolve(this.deliveries)
  }

  ship(uuids: Array<UUID>): Promise<Array<Delivery>> {
    const res: Array<Delivery> = []
    uuids.forEach((uuid) => {
      const index = this.deliveries.findIndex(
        (delivery) => delivery.uuid === uuid
      )
      this.deliveries[index].status = DeliveryStatus.Shipped
      res.push(this.deliveries[index])
    })
    return Promise.resolve(res)
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
