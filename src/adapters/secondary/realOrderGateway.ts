import { OrderGateway } from '@core/gateways/orderGateway'
import { Order } from '@core/entities/order'
import { UUID } from '@core/types/types'
import axios from 'axios'

export class RealOrderGateway implements OrderGateway {
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = `${baseUrl}`
  }

  async askHowToFinish(preparation: Order): Promise<Order> {
    const body: any = {
      orderUuid: preparation.uuid
    }
    const res = await axios.post(
      `${this.baseUrl}/ask-how-to-finish/`,
      JSON.stringify(body)
    )
    return this.convertToOrder(res.data)
  }

  cancelPreparation(preparation: Order): Promise<Order> {
    throw Error('Not implemented')
  }

  async getByUuid(uuid: UUID): Promise<Order> {
    const res = await axios.get(`${this.baseUrl}/orders/${uuid}/`)
    return Promise.resolve(this.convertToOrder(res.data))
  }

  list(): Promise<Array<Order>> {
    throw Error('Not implemented')
  }

  async listOrdersToPrepare(): Promise<Array<Order>> {
    const res = await axios.get(`${this.baseUrl}/preparations/`)
    return Promise.resolve(
      res.data.map((d: any) => {
        return this.convertToOrder(d)
      })
    )
  }

  async savePreparation(preparation: Order): Promise<Order> {
    const res = await axios.post(
      `${this.baseUrl}/save-preparation/`,
      JSON.stringify(preparation)
    )
    return this.convertToOrder(res.data)
  }

  async startPreparation(uuid: UUID): Promise<Order> {
    const res = await axios.post(
      `${this.baseUrl}/start-preparation/`,
      JSON.stringify(uuid)
    )
    return this.convertToOrder(res.data)
  }

  async validatePreparation(preparation: Order): Promise<Order> {
    const res = await axios.post(
      `${this.baseUrl}/validate-preparation/`,
      JSON.stringify({
        uuid: preparation.uuid,
        lines: preparation.lines
      })
    )
    return this.convertToOrder(res.data)
  }

  private convertToOrder(data: any): Order {
    const copy = JSON.parse(JSON.stringify(data))
    delete copy.payment.sessionUrl
    copy.lines.forEach((l: any) => {
      delete l.img
      delete l.description
      delete l.productUuid
    })
    copy.messages.forEach((m: any) => {
      delete m.orderUuid
      delete m.content.data
      m.content = m.content.type
    })
    return copy
  }
}
