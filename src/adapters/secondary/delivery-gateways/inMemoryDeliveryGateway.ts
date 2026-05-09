import { Delivery, DeliveryStatus } from '@core/entities/delivery'
import { DeliveryGateway } from '@core/gateways/deliveryGateway'
import { UUID } from '@core/types/types'

export class InMemoryDeliveryGateway implements DeliveryGateway {
  private deliveries: Array<Delivery> = []
  private printed: Array<UUID> = []
  private downloaded: Array<UUID> = []
  private generatedPickups: Array<UUID> = []
  private generatePickupError: Error | null = null

  list(): Promise<Array<Delivery>> {
    return Promise.resolve(JSON.parse(JSON.stringify(this.deliveries)))
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

  downloadLabel(uuid: UUID): Promise<Blob> {
    this.downloaded.push(uuid)
    return Promise.resolve(new Blob([uuid], { type: 'application/pdf' }))
  }

  markAsDelivered(uuid: UUID): Promise<Delivery> {
    const index = this.deliveries.findIndex(
      (delivery) => delivery.uuid === uuid
    )
    this.deliveries[index].status = DeliveryStatus.Delivered
    return Promise.resolve(JSON.parse(JSON.stringify(this.deliveries[index])))
  }

  generatePickup(orderUuid: UUID): Promise<void> {
    if (this.generatePickupError) {
      return Promise.reject(this.generatePickupError)
    }
    this.generatedPickups.push(orderUuid)
    return Promise.resolve()
  }

  listPrinted(): Array<UUID> {
    return this.printed
  }

  listDownloaded(): Array<UUID> {
    return this.downloaded
  }

  listGeneratedPickups(): Array<UUID> {
    return this.generatedPickups
  }

  feedGeneratePickupError(error: Error) {
    this.generatePickupError = error
  }

  feedWith(...deliveries: Array<Delivery>) {
    this.deliveries = deliveries
  }
}
