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

  override list(): Promise<Array<Order>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.list())
      }, this.timeoutInMs)
    })
  }

  override listOrdersToPrepare(): Promise<Array<Order>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.listOrdersToPrepare())
      }, this.timeoutInMs)
    })
  }

  override startPreparation(uuid: UUID): Promise<Order> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.startPreparation(uuid))
      }, this.timeoutInMs)
    })
  }

  override getByUuid(uuid: UUID): Promise<Order> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.getByUuid(uuid))
      }, this.timeoutInMs)
    })
  }

  override async validatePreparation(preparation: Order): Promise<Order> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.validatePreparation(preparation))
      }, this.timeoutInMs)
    })
  }

  override async savePreparation(preparation: Order): Promise<Order> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.savePreparation(preparation))
      }, this.timeoutInMs)
    })
  }

  override async askHowToFinish(order: Order): Promise<Order> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.askHowToFinish(order))
      }, this.timeoutInMs)
    })
  }

  override async cancelPreparation(preparation: Order): Promise<Order> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.cancelPreparation(preparation))
      }, this.timeoutInMs)
    })
  }
}
