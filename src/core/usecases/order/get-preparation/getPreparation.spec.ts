import { createPinia, setActivePinia } from 'pinia'
import { usePreparationStore } from '@store/preparationStore'
import { InMemoryOrderGateway } from '@adapters/secondary/inMemoryOrderGateway'
import { orderToPrepare1, orderToPrepare2 } from '@utils/testData/orders'
import { Order } from '@core/entities/order'
import { UUID } from '@core/types/types'
import { getPreparation } from '@core/usecases/order/get-preparation/getPreparation'
import { PreparationDoesNotExistsError } from '@core/errors/preparationDoesNotExistsError'

describe('Get preparation', () => {
  let preparationStore: any
  let orderGateway: InMemoryOrderGateway
  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
    orderGateway = new InMemoryOrderGateway()
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
