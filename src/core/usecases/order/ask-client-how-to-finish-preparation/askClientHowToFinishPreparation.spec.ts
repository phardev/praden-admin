import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryOrderGateway } from '@adapters/secondary/order-gateways/InMemoryOrderGateway'
import { Message, MessageContent, Order } from '@core/entities/order'
import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'
import { PreparationDoesNotExistsError } from '@core/errors/PreparationDoesNotExistsError'
import { askClientHowToFinishPreparation } from '@core/usecases/order/ask-client-how-to-finish-preparation/askClientHowToFinishPreparation'
import { usePreparationStore } from '@store/preparationStore'
import { orderToPrepare1, orderToPrepare2 } from '@utils/testData/orders'
import { createPinia, setActivePinia } from 'pinia'

describe('Ask client how to finish preparation', () => {
  let preparationStore: any
  let orderGateway: InMemoryOrderGateway
  const dateProvider = new FakeDateProvider()

  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
    orderGateway = new InMemoryOrderGateway(dateProvider)
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
  })

  describe('There is no current preparation', () => {
    it('should throw an error', async () => {
      await expect(whenAskClientHowToFinishPreparation()).rejects.toThrow(
        NoPreparationSelectedError
      )
    })
  })

  describe('Loading', () => {
    beforeEach(() => {
      givenThereIsExistingOrders(orderToPrepare2)
      givenThereIsACurrentPreparation(orderToPrepare2)
    })
    it('should be aware during loading', async () => {
      const unsubscribe = preparationStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenAskClientHowToFinishPreparation()
    })
    it('should be aware that loading is over', async () => {
      await whenAskClientHowToFinishPreparation()
      expect(preparationStore.isLoading).toBe(false)
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
    await askClientHowToFinishPreparation(orderGateway)
  }
})
