import { OrderGateway } from '@core/gateways/orderGateway'
import {
  DeliveryStatus,
  Order,
  OrderLine,
  PaymentStatus
} from '@core/entities/order'
import type { HashTable, UUID } from '@core/types/types'
import { zoneGeo } from '@utils/testData/locations'
import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'

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
        } else if (typeof value === 'object' && value !== null) {
          for (const subKey in value) {
            if (value.hasOwnProperty(subKey)) {
              formData.append(`${key}[${subKey}]`, value[subKey])
            }
          }
        } else {
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
        deliveryStatus: this.getDeliveryStatus(l.deliveryStatus),
        locations: { [zoneGeo.uuid]: l.location },
        updatedAt: l.updatedAt
      }
      return res
    })
    copy.lines.forEach((l: any) => {
      delete l.img
      delete l.description
      delete l.location
    })
    copy.messages = data.messages
      .sort((m1, m2) => m1.updatedAt - m2.updatedAt)
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
  private getDeliveryStatus(status: string): DeliveryStatus {
    if (status === 'CREATED') return DeliveryStatus.Created
    if (status === 'PROCESSING') return DeliveryStatus.Processing
    if (status === 'SHIPPED') return DeliveryStatus.Shipped
    if (status === 'DELIVERED') return DeliveryStatus.Delivered
    if (status === 'CANCELED') return DeliveryStatus.Canceled
    return DeliveryStatus.Created
  }

  private getPaymentStatus(status: string): PaymentStatus {
    if (status === 'WAITINGFORPAYMENT') return PaymentStatus.WaitingForPayment
    if (status === 'PAYED') return PaymentStatus.Payed
    if (status === 'REJECTED') return PaymentStatus.Rejected
    return PaymentStatus.WaitingForPayment
  }
}
