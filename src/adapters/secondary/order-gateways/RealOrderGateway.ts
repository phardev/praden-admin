import { OrderGateway } from '@core/gateways/orderGateway'
import {
  OrderLineStatus,
  Order,
  OrderLine,
  PaymentStatus
} from '@core/entities/order'
import type { HashTable, UUID } from '@core/types/types'
import { zoneGeo } from '@utils/testData/locations'
import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { DeliveryStatus } from '@core/entities/delivery'

export abstract class RealGateway {
  protected readonly baseUrl: string

  protected constructor(baseUrl: string) {
    this.baseUrl = `${baseUrl}`
  }

  protected createFormData(dto: any): FormData {
    const formData = new FormData()

    for (const key in dto) {
      if (dto.hasOwnProperty(key)) {
        const value = dto[key]
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item)
          })
        } else if (value instanceof File) {
          formData.append(key, value)
        } else if (typeof value === 'object' && value !== null) {
          for (const subKey in value) {
            if (value.hasOwnProperty(subKey)) {
              formData.append(`${key}[${subKey}]`, value[subKey])
            }
          }
        } else if (value !== undefined) {
          formData.append(key, value)
        }
      }
    }
    return formData
  }
}

export class RealOrderGateway extends RealGateway implements OrderGateway {
  constructor(baseUrl: string) {
    super(baseUrl)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  batch(uuids: Array<UUID>): Promise<Array<Order>> {
    throw new Error('Method not implemented.')
  }

  async askHowToFinish(preparation: Order): Promise<Order> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/preparations/${preparation.uuid}/ask-how-to-finish/`
    )
    return this.convertToOrder(res.data.item)
  }

  async cancelPreparation(preparation: Order): Promise<Order> {
    const body: any = {
      orderUuid: preparation.uuid
    }
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/preparations/${preparation.uuid}/cancel/`,
      JSON.stringify(body)
    )
    return this.convertToOrder(res.data.item)
  }

  async getByUuid(uuid: UUID): Promise<Order> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/orders/${uuid}/`)
    return Promise.resolve(this.convertToOrder(res.data.item))
  }

  async list(): Promise<Array<Order>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/orders/`)
    return Promise.resolve(
      res.data.items.map((d: any) => {
        return this.convertToOrder(d)
      })
    )
  }

  async listOrdersToPrepare(): Promise<Array<Order>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/preparations/`)
    return Promise.resolve(
      res.data.items.map((d: any) => {
        return this.convertToOrder(d)
      })
    )
  }

  async savePreparation(preparation: Order): Promise<Order> {
    const lines: HashTable<number> = {}
    preparation.lines.forEach((l) => {
      lines[l.productUuid] = l.preparedQuantity
    })
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/preparations/${preparation.uuid}/save/`,
      { lines }
    )
    return this.convertToOrder(res.data.item)
  }

  async startPreparation(uuid: UUID): Promise<Order> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/preparations/${uuid}/start/`,
      JSON.stringify(uuid)
    )
    return this.convertToOrder(res.data.item)
  }

  async validatePreparation(preparation: Order): Promise<Order> {
    const lines: HashTable<number> = {}
    preparation.lines.forEach((l) => {
      lines[l.productUuid] = l.preparedQuantity
    })
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/preparations/${preparation.uuid}/validate/`,
      {
        lines
      }
    )
    return this.convertToOrder(res.data.item)
  }

  private convertToOrder(data: any): Order {
    const copy = JSON.parse(JSON.stringify(data))
    copy.lines = copy.lines.map((l: any) => {
      const res: OrderLine = {
        productUuid: l.productUuid,
        ean13: l.ean13,
        expectedQuantity: l.expectedQuantity,
        name: l.name,
        percentTaxRate: l.percentTaxRate,
        preparedQuantity: l.preparedQuantity,
        unitAmount: l.priceWithoutTax,
        status: this.getOrderLineStatus(l.status),
        locations: { [zoneGeo.uuid]: l.location },
        updatedAt: l.updatedAt
      }
      return res
    })
    copy.deliveries = copy.deliveries.map((d: any) => {
      return {
        ...d,
        status: this.getDeliveryStatus(d.status)
      }
    })
    copy.lines.forEach((l: any) => {
      delete l.img
      delete l.description
      delete l.location
    })
    copy.messages = data.messages
      .sort((m1: any, m2: any) => m1.updatedAt - m2.updatedAt)
      .map((m: any) => {
        return {
          content: m.data.type,
          sentAt: m.updatedAt
        }
      })
    if (copy.payment) {
      copy.payment.status = this.getPaymentStatus(copy.payment.status)
    }
    return copy
  }

  private getOrderLineStatus(status: string): OrderLineStatus {
    if (status === 'CREATED') return OrderLineStatus.Created
    if (status === 'STARTED') return OrderLineStatus.Started
    if (status === 'PREPARED') return OrderLineStatus.Prepared
    if (status === 'CANCELED') return OrderLineStatus.Canceled
    return OrderLineStatus.Created
  }

  private getDeliveryStatus(status: string): DeliveryStatus {
    if (status === 'CREATED') return DeliveryStatus.Created
    if (status === 'PREPARED') return DeliveryStatus.Prepared
    if (status === 'SHIPPED') return DeliveryStatus.Shipped
    if (status === 'DELIVERED') return DeliveryStatus.Delivered
    return DeliveryStatus.Created
  }

  private getPaymentStatus(status: string): PaymentStatus {
    if (status === 'WAITINGFORPAYMENT') return PaymentStatus.WaitingForPayment
    if (status === 'PAYED') return PaymentStatus.Payed
    if (status === 'REJECTED') return PaymentStatus.Rejected
    return PaymentStatus.WaitingForPayment
  }
}
