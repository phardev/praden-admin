import { createPinia, setActivePinia } from 'pinia'
import { orderToPrepare1, orderToPrepare2 } from '@utils/testData/orders'
import { Message, MessageContent, Order } from '@core/entities/order'
import { usePreparationStore } from '@store/preparationStore'
import { askClientHowToFinishPreparation } from '@core/usecases/order/ask-client-how-to-finish-preparation/askClientHowToFinishPreparation'
import { InMemoryOrderGateway } from '@adapters/secondary/inMemoryOrderGateway'
import { FakeDateProvider } from '@adapters/secondary/fakeDateProvider'
import { DateProvider } from '@core/gateways/dateProvider'
import { NoPreparationSelectedError } from '@core/errors/noPreparationSelectedError'
import { PreparationDoesNotExistsError } from '@core/errors/preparationDoesNotExistsError'

export interface MessageGateway {
  list(): Promise<Array<Message>>
  create(content: MessageContent): Promise<Message>
}

export class InMemoryMessageGateway implements MessageGateway {
  private messages: Array<Message> = []
  private dateProvider: DateProvider
  constructor(dateProvider: DateProvider) {
    this.dateProvider = dateProvider
  }
  list(): Promise<Array<Message>> {
    return Promise.resolve(this.messages)
  }
  create(content: MessageContent): Promise<Message> {
    const message = {
      content,
      sentAt: this.dateProvider.now()
    }
    this.messages.push(message)
    return Promise.resolve(message)
  }
}

describe('Ask client how to finish preparation', () => {
  let preparationStore: any
  let orderGateway: InMemoryOrderGateway
  let messageGateway: InMemoryMessageGateway
  const dateProvider = new FakeDateProvider()

  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
    orderGateway = new InMemoryOrderGateway(new FakeDateProvider())
  })
  describe('For an existing order', () => {
    const expectedOrder = JSON.parse(JSON.stringify(orderToPrepare1))
    const message: Message = {
      content: MessageContent.AskToClient,
      sentAt: 123456789
    }
    expectedOrder.messages = [message]
    beforeEach(async () => {
      givenThereIsExistingOrders(orderToPrepare1)
      givenThereIsACurrentPreparation(orderToPrepare1)
      dateProvider.feedWith(123456789)
      messageGateway = new InMemoryMessageGateway(dateProvider)
      await whenAskClientHowToFinishPreparation()
    })
    it('should save the message in the order gateway', async () => {
      expect(await orderGateway.list()).toStrictEqual([expectedOrder])
    })
    it('should save the message in the preparation store', () => {
      expect(preparationStore.items).toStrictEqual([expectedOrder])
    })
    it('should save the message in the current preparation', () => {
      expect(preparationStore.current).toStrictEqual(expectedOrder)
    })
    it('should save the message in the message gateway', async () => {
      expect(await messageGateway.list()).toStrictEqual([message])
    })
  })
  describe('For another existing order', () => {
    const expectedOrder = JSON.parse(JSON.stringify(orderToPrepare2))
    const message: Message = {
      content: MessageContent.AskToClient,
      sentAt: 987654321
    }
    expectedOrder.messages = [message]
    beforeEach(async () => {
      givenThereIsExistingOrders(orderToPrepare2)
      givenThereIsACurrentPreparation(orderToPrepare2)
      dateProvider.feedWith(987654321)
      messageGateway = new InMemoryMessageGateway(dateProvider)
      await whenAskClientHowToFinishPreparation()
    })
    it('should save the message in the order gateway', async () => {
      expect(await orderGateway.list()).toStrictEqual([expectedOrder])
    })
    it('should save the message in the preparation store', () => {
      expect(preparationStore.items).toStrictEqual([expectedOrder])
    })
    it('should save the message in the current preparation', () => {
      expect(preparationStore.current).toStrictEqual(expectedOrder)
    })
    it('should save the message in the message gateway', async () => {
      expect(await messageGateway.list()).toStrictEqual([message])
    })
  })

  describe('There is no current preparation', () => {
    it('should throw an error', async () => {
      await expect(whenAskClientHowToFinishPreparation()).rejects.toThrow(
        NoPreparationSelectedError
      )
    })
  })
  describe('The current preparation does not exists', () => {
    it('should throw an error', async () => {
      givenThereIsACurrentPreparation(orderToPrepare1)
      await expect(whenAskClientHowToFinishPreparation()).rejects.toThrow(
        PreparationDoesNotExistsError
      )
    })
  })
  const givenThereIsExistingOrders = (...orders: Array<Order>) => {
    orderGateway.feedWith(...orders)
    preparationStore.items = orders
  }

  const givenThereIsACurrentPreparation = (order: Order) => {
    preparationStore.current = order
  }

  const whenAskClientHowToFinishPreparation = async () => {
    await askClientHowToFinishPreparation(orderGateway, messageGateway)
  }
})
