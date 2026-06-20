import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { Delivery, DeliveryStatus } from '@core/entities/delivery'
import {
  CarrierErrorDetail,
  CarrierLabelError
} from '@core/errors/CarrierLabelError'
import { DeliveryGateway } from '@core/gateways/deliveryGateway'
import { UUID } from '@core/types/types'
import axios, { AxiosError } from 'axios'

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
    try {
      await axiosWithBearer.post(
        `${this.baseUrl}/deliveries/${uuid}/print-label`
      )
    } catch (e) {
      throw await this.toCarrierError(e)
    }
  }

  async downloadLabel(uuid: UUID): Promise<Blob> {
    try {
      const res = await axiosWithBearer.get(
        `${this.baseUrl}/deliveries/${uuid}/download-label`,
        {
          responseType: 'blob'
        }
      )
      return new Blob([res.data], { type: 'application/pdf' })
    } catch (e) {
      throw await this.toCarrierError(e)
    }
  }

  async generatePickup(orderUuid: UUID): Promise<void> {
    try {
      await axiosWithBearer.post(`${this.baseUrl}/pickup`, { orderUuid })
    } catch (e) {
      throw await this.toCarrierError(e)
    }
  }

  async setTrackingNumber(uuid: UUID, trackingNumber: string): Promise<void> {
    await axiosWithBearer.patch(
      `${this.baseUrl}/deliveries/${uuid}/tracking-number`,
      { trackingNumber }
    )
  }

  private async toCarrierError(error: unknown): Promise<unknown> {
    if (axios.isAxiosError(error) && error.response?.status === 500) {
      const detail = await this.readCarrierErrorDetail(error)
      if (detail !== undefined) {
        return new CarrierLabelError(detail)
      }
    }
    return error
  }

  private async readCarrierErrorDetail(
    error: AxiosError
  ): Promise<CarrierErrorDetail | null | undefined> {
    const data = error.response?.data
    if (data instanceof Blob) {
      const text = await data.text()
      try {
        const parsed = JSON.parse(text) as { carrierError?: unknown }
        return this.extractCarrierError(parsed)
      } catch {
        return undefined
      }
    }
    if (typeof data === 'object' && data !== null) {
      return this.extractCarrierError(data as Record<string, unknown>)
    }
    return undefined
  }

  private extractCarrierError(
    body: Record<string, unknown> | { carrierError?: unknown }
  ): CarrierErrorDetail | null | undefined {
    if (!('carrierError' in body)) return undefined
    const carrierError = (body as { carrierError: unknown }).carrierError
    if (carrierError === null) return null
    return carrierError as CarrierErrorDetail
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
