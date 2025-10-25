import { InMemoryCustomerGateway } from '@adapters/secondary/customer-gateways/inMemoryCustomerGateway'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryOrderGateway } from '@adapters/secondary/order-gateways/InMemoryOrderGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Customer } from '@core/entities/customer'
import { Order } from '@core/entities/order'
import { UUID } from '@core/types/types'
import { getOrder } from '@core/usecases/order/get-order/getOrder'
import { useCustomerStore } from '@store/customerStore'
import { useOrderStore } from '@store/orderStore'
import { elodieDurand, lucasLefevre } from '@utils/testData/customers'
import {
  elodieDurandOrder2,
  lucasLefevreOrder1,
  orderToPrepare1,
  orderToPrepare2,
  orderToPrepare3
} from '@utils/testData/orders'
import { createPinia, setActivePinia } from 'pinia'

describe('Get order', () => {
  let orderGateway: InMemoryOrderGateway
  let customerGateway: InMemoryCustomerGateway
  let orderStore: any
  let customerStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    orderGateway = new InMemoryOrderGateway(new FakeDateProvider())
    orderStore = useOrderStore()
    customerGateway = new InMemoryCustomerGateway(new FakeUuidGenerator())
    customerStore = useCustomerStore()
  })

  describe('The order exists', () => {
    describe('Anonymous order', () => {
      it('should save an order', async () => {
        givenExistingOrders(orderToPrepare1, orderToPrepare2, orderToPrepare3)
        await whenGetOrder(orderToPrepare1.uuid)
        expectCurrentOrderToBe(orderToPrepare1)
      })
    })
    describe('Customer order', () => {
      beforeEach(async () => {
        givenExistingOrders(lucasLefevreOrder1, elodieDurandOrder2)
        givenExistingCustomers(lucasLefevre, elodieDurand)
        givenAlreadyLoadedCustomers(elodieDurand)
        await whenGetOrder(lucasLefevreOrder1.uuid)
      })
      it('should save a customer order', () => {
        expectCurrentOrderToBe(lucasLefevreOrder1)
      })
      it('should add the customer to customer order', () => {
        expectCustomerStoreToEqual(elodieDurand, lucasLefevre)
      })
    })
  })

  const givenExistingOrders = (...orders: Array<Order>) => {
    orderGateway.feedWith(...orders)
  }

  const givenExistingCustomers = (...customers: Array<Customer>) => {
    customerGateway.feedWith(...customers)
  }

  const givenAlreadyLoadedCustomers = (...customers: Array<Customer>) => {
    customerStore.items = customers
  }

  const whenGetOrder = async (uuid: UUID) => {
    await getOrder(uuid, orderGateway, customerGateway)
  }

  const expectCurrentOrderToBe = (order: Order) => {
    expect(orderStore.current).toStrictEqual(order)
  }

  const expectCustomerStoreToEqual = (...customers: Array<Customer>) => {
    expect(customerStore.items).toStrictEqual(customers)
  }
})
