import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryOrderGateway } from '@adapters/secondary/order-gateways/InMemoryOrderGateway'
import { Order } from '@core/entities/order'
import { PreparationDoesNotExistsError } from '@core/errors/PreparationDoesNotExistsError'
import { UUID } from '@core/types/types'
import { getPreparation } from '@core/usecases/order/get-preparation/getPreparation'
import { usePreparationStore } from '@store/preparationStore'
import { orderToPrepare1, orderToPrepare2 } from '@utils/testData/orders'
import { createPinia, setActivePinia } from 'pinia'

describe('Get preparation', () => {
  let preparationStore: any
  let orderGateway: InMemoryOrderGateway
  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
    orderGateway = new InMemoryOrderGateway(new FakeDateProvider())
  })
  describe('The preparation exists', () => {
    it('should get the preparation', async () => {
      givenPreparationExists(orderToPrepare1)
      await whenGetPreparation(orderToPrepare1.uuid)
      expectCurrentPreparationToBe(orderToPrepare1)
    })
    it('should get another preparation', async () => {
      givenPreparationExists(orderToPrepare1, orderToPrepare2)
      await whenGetPreparation(orderToPrepare2.uuid)
      expectCurrentPreparationToBe(orderToPrepare2)
    })
  })
  describe('Loading', () => {
    beforeEach(() => {
      givenPreparationExists(orderToPrepare2)
    })
    it('should be aware during loading', async () => {
      const unsubscribe = preparationStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenGetPreparation(orderToPrepare2.uuid)
    })
    it('should be aware that loading is over', async () => {
      await whenGetPreparation(orderToPrepare2.uuid)
      expect(preparationStore.isLoading).toBe(false)
    })
  })

  describe('The preparation does not exists', () => {
    it('should throw an error', async () => {
      await expect(whenGetPreparation('NotExists')).rejects.toThrow(
        PreparationDoesNotExistsError
      )
    })
  })
  const givenPreparationExists = (...orders: Array<Order>) => {
    orderGateway.feedWith(...orders)
  }
  const whenGetPreparation = async (uuid: UUID) => {
    await getPreparation(uuid, orderGateway)
  }
  const expectCurrentPreparationToBe = (order: Order) => {
    expect(preparationStore.current).toStrictEqual(order)
  }
})
