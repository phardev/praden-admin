import { Order } from '@core/entities/order'
import { UUID } from '@core/types/types'
import { DateProvider } from '@core/gateways/dateProvider'
import { InMemoryOrderGateway } from '@adapters/secondary/order-gateways/InMemoryOrderGateway'

export class InMemoryTimoutOrderGateway extends InMemoryOrderGateway {
  private readonly timeoutInMs: number

  constructor(timeoutInMs: number, dateProvider: DateProvider) {
    super(dateProvider)
    this.timeoutInMs = timeoutInMs
  }

  list(): Promise<Array<Order>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.list())
      }, this.timeoutInMs)
    })
  }

  listOrdersToPrepare(): Promise<Array<Order>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.listOrdersToPrepare())
      }, this.timeoutInMs)
    })
  }

  startPreparation(uuid: UUID): Promise<Order> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.startPreparation(uuid))
      }, this.timeoutInMs)
    })
  }

  getByUuid(uuid: UUID): Promise<Order> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.getByUuid(uuid))
      }, this.timeoutInMs)
    })
  }

  async validatePreparation(preparation: Order): Promise<Order> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.validatePreparation(preparation))
      }, this.timeoutInMs)
    })
  }

  async savePreparation(preparation: Order): Promise<Order> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.savePreparation(preparation))
      }, this.timeoutInMs)
    })
  }

  async askHowToFinish(order: Order): Promise<Order> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.askHowToFinish(order))
      }, this.timeoutInMs)
    })
  }

  async cancelPreparation(preparation: Order): Promise<Order> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.cancelPreparation(preparation))
      }, this.timeoutInMs)
    })
  }
}
