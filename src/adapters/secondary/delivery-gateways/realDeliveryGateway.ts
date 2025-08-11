import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { Delivery, DeliveryStatus } from '@core/entities/delivery'
import { DeliveryGateway } from '@core/gateways/deliveryGateway'
import { UUID } from '@core/types/types'
import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'

export class RealDeliveryGateway
  extends RealGateway
  implements DeliveryGateway
{
  constructor(url: string) {
    super(url)
  }

  async list(): Promise<Array<Delivery>> {
    const filters = {
      status: 'PREPARED',
      type: 'DELIVERY'
    }
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/deliveries`,
      filters
    )
    return res.data.map((d: any) => {
      return this.convertToDelivery(d)
    })
  }

  async ship(uuids: Array<UUID>): Promise<Array<Delivery>> {
    const res = await axiosWithBearer.post(`${this.baseUrl}/deliveries/ship`, {
      uuids
    })
    return res.data.map((d: any) => {
      return this.convertToDelivery(d)
    })
  }

  async markAsDelivered(uuid: UUID): Promise<Delivery> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/deliveries/mark-as-delivered`,
      {
        uuids: [uuid]
      }
    )
    return this.convertToDelivery(res.data[0])
  }

  async printLabel(uuid: UUID): Promise<void> {
    await axiosWithBearer.post(`${this.baseUrl}/deliveries/${uuid}/print-label`)
  }

  async downloadLabel(uuid: UUID): Promise<Blob> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/deliveries/${uuid}/download-label`,
      {
        responseType: 'blob'
      }
    )
    return new Blob([res.data], { type: 'application/pdf' })
  }

  private convertToDelivery(delivery: any) {
    return {
      ...delivery,
      status: this.getStatus(delivery.status)
    }
  }

  private getStatus(status: string): DeliveryStatus {
    if (status === 'CREATED') return DeliveryStatus.Created
    if (status === 'PREPARED') return DeliveryStatus.Prepared
    if (status === 'SHIPPED') return DeliveryStatus.Shipped
    if (status === 'DELIVERED') return DeliveryStatus.Delivered
    return DeliveryStatus.Created
  }
}
