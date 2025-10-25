import { FakeSearchGateway } from '@adapters/secondary/search-gateways/FakeSearchGateway'
import { DeliveryStatus } from '@core/entities/delivery'
import { Order, OrderLineStatus, PaymentStatus } from '@core/entities/order'
import {
  SearchOrdersDTO,
  searchOrders
} from '@core/usecases/order/orders-searching/searchOrders'
import { useOrderStore } from '@store/orderStore'
import { useSearchStore } from '@store/searchStore'
import { elodieDurand, lucasLefevre } from '@utils/testData/customers'
import {
  elodieDurandOrder2,
  lucasLefevreOrder1,
  lucasLefevreOrder2,
  orderDelivered2,
  orderInPreparation1,
  orderNotPayed1,
  orderPartiallyShipped1,
  orderPrepared1,
  orderToPrepare1,
  orderToPrepare2,
  orderToPrepare3
} from '@utils/testData/orders'
import { createPinia, setActivePinia } from 'pinia'

describe('Search orders', () => {
  let searchStore: any
  let url = 'https://localhost:3000/'
  let searchGateway: FakeSearchGateway
  let dto: SearchOrdersDTO

  beforeEach(() => {
    setActivePinia(createPinia())
    searchStore = useSearchStore()
    searchGateway = new FakeSearchGateway()
    dto = {}
  })

  describe('There is no filters', () => {
    beforeEach(async () => {
      dto.query = ''
      await whenSearchForOrders(dto)
    })
    it('should return an empty array', async () => {
      expectSearchResultToEqual()
    })
    it('should save the search', () => {
      expectCurrentFilterToBe(dto)
    })
  })

  describe('Other urls', () => {
    beforeEach(async () => {
      url = 'https://another-url.com/'
      dto.query = ''
      await whenSearchForOrders(dto)
    })
    it('should save the result for another url', () => {
      expectSearchResultToEqual()
    })
    it('should save the search for another url', () => {
      expectCurrentFilterToBe(dto)
    })
  })

  describe('There is some filters', () => {
    describe('Save current filter', () => {
      it('should save a filter', async () => {
        dto.query = 'a-filter'
        await whenSearchForOrders(dto)
        expectCurrentFilterToBe(dto)
      })
      it('should save another filter', async () => {
        dto.query = 'another-filter'
        await whenSearchForOrders(dto)
        expectCurrentFilterToBe(dto)
      })
    })
    describe('Filter on reference', () => {
      beforeEach(() => {
        givenExistingOrders(orderPrepared1, orderToPrepare1)
      })
      it('should get one product with reference containing the query', async () => {
        dto.query = 'jour'
        await whenSearchForOrders(dto)
        expectSearchResultToEqual(orderPrepared1)
      })
      it('should get multiple products with referemce containing the query', async () => {
        dto.query = 'XIKO'
        await whenSearchForOrders(dto)
        expectSearchResultToEqual(orderToPrepare1)
      })
      it('should get nothing with reference not containing the query', async () => {
        dto.query = 'querywithoutresult'
        await whenSearchForOrders(dto)
        expectSearchResultToEqual()
      })
    })
    describe('Filter client name', () => {
      beforeEach(() => {
        givenExistingOrders(orderToPrepare1, orderToPrepare2, orderToPrepare3)
      })
      it('should get one order with client name containing the query', async () => {
        dto.query = 'bon'
        await whenSearchForOrders(dto)
        expectSearchResultToEqual(orderToPrepare1)
      })
      it('should get multiple orders with client name containing the query', async () => {
        dto.query = 'jeann'
        await whenSearchForOrders(dto)
        expectSearchResultToEqual(orderToPrepare2, orderToPrepare3)
      })
      it('should get nothing with client name not containing the query', async () => {
        dto.query = 'querywithoutresult'
        await whenSearchForOrders(dto)
        expectSearchResultToEqual()
      })
    })
    describe('Filter on date', () => {
      beforeEach(() => {
        givenExistingOrders(
          orderInPreparation1,
          orderNotPayed1,
          orderPartiallyShipped1
        )
      })
      it('should get orders with date before order created date', async () => {
        dto.startDate = orderPartiallyShipped1.createdAt - 1000
        await whenSearchForOrders(dto)
        expectSearchResultToEqual(orderInPreparation1, orderPartiallyShipped1)
      })
      it('should get orders with date after order created date', async () => {
        dto.endDate = orderPartiallyShipped1.createdAt + 1000
        await whenSearchForOrders(dto)
        expectSearchResultToEqual(orderNotPayed1, orderPartiallyShipped1)
      })
      it('should get orders with order date between', async () => {
        dto.startDate = orderPartiallyShipped1.createdAt - 1000
        dto.endDate = orderPartiallyShipped1.createdAt + 1000
        await whenSearchForOrders(dto)
        expectSearchResultToEqual(orderPartiallyShipped1)
      })
      it('should mix result with query', async () => {
        dto.startDate = orderPartiallyShipped1.createdAt - 1000
        dto.query = 'utr'
        await whenSearchForOrders(dto)
        expectSearchResultToEqual(orderInPreparation1)
      })
    })
    describe('Filter on delivery status', () => {
      beforeEach(() => {
        givenExistingOrders(
          orderToPrepare1,
          orderToPrepare2,
          orderPartiallyShipped1,
          orderDelivered2
        )
      })
      it('should filter on a status', async () => {
        dto.deliveryStatus = DeliveryStatus.Shipped
        await whenSearchForOrders(dto)
        expectSearchResultToEqual(orderPartiallyShipped1)
      })
      it('should filter on another status', async () => {
        dto.deliveryStatus = DeliveryStatus.Created
        await whenSearchForOrders(dto)
        expectSearchResultToEqual(orderToPrepare1, orderToPrepare2)
      })
    })
    describe('Filter on order status', () => {
      beforeEach(() => {
        givenExistingOrders(
          orderToPrepare1,
          orderToPrepare2,
          orderPartiallyShipped1,
          orderDelivered2
        )
      })
      it('should filter on a status', async () => {
        dto.orderStatus = OrderLineStatus.Prepared
        await whenSearchForOrders(dto)
        expectSearchResultToEqual(orderPartiallyShipped1, orderDelivered2)
      })
      it('should filter on another status', async () => {
        dto.orderStatus = OrderLineStatus.Created
        await whenSearchForOrders(dto)
        expectSearchResultToEqual(orderToPrepare1, orderToPrepare2)
      })
    })
    describe('Filter on payment status', () => {
      beforeEach(() => {
        givenExistingOrders(
          orderToPrepare1,
          orderNotPayed1,
          orderPartiallyShipped1
        )
      })
      it('should filter on a payed orders', async () => {
        dto.paymentStatus = PaymentStatus.Payed
        await whenSearchForOrders(dto)
        expectSearchResultToEqual(orderToPrepare1, orderPartiallyShipped1)
      })
      it('should filter on waiting for payment status', async () => {
        dto.paymentStatus = PaymentStatus.WaitingForPayment
        await whenSearchForOrders(dto)
        expectSearchResultToEqual(orderNotPayed1)
      })
    })
    describe('Filter on customer uuid', () => {
      beforeEach(() => {
        givenExistingOrders(
          lucasLefevreOrder1,
          elodieDurandOrder2,
          lucasLefevreOrder2
        )
      })
      it('should filter on a customer', async () => {
        dto.customerUuid = lucasLefevre.uuid
        await whenSearchForOrders(dto)
        expectSearchResultToEqual(lucasLefevreOrder1, lucasLefevreOrder2)
      })
      it('should filter on another customer', async () => {
        dto.customerUuid = elodieDurand.uuid
        await whenSearchForOrders(dto)
        expectSearchResultToEqual(elodieDurandOrder2)
      })
    })
    describe('Apply mulitple filters in multiple steps', () => {
      it('should apply all filters', async () => {
        givenExistingOrders(
          orderToPrepare1,
          orderToPrepare2,
          orderNotPayed1,
          orderInPreparation1,
          orderPartiallyShipped1,
          orderDelivered2
        )
        dto.query = 'bon'
        await whenSearchForOrders(dto)
        dto.startDate = orderToPrepare1.createdAt + 1000
        await whenSearchForOrders(dto)
        dto.orderStatus = OrderLineStatus.Prepared
        dto.deliveryStatus = DeliveryStatus.Shipped
        await whenSearchForOrders(dto)
        expectSearchResultToEqual(orderPartiallyShipped1)
      })
    })
  })

  const givenExistingOrders = (...orders: Array<Order>) => {
    const orderStore = useOrderStore()
    orderStore.items = orders
  }

  const whenSearchForOrders = async (dto: Partial<SearchOrdersDTO>) => {
    await searchOrders(url, dto, searchGateway)
  }

  const expectSearchResultToEqual = (...expectedRes: Array<any>) => {
    expect(searchStore.get(url)).toStrictEqual(expectedRes)
  }

  const expectCurrentFilterToBe = (currentFilter: Partial<SearchOrdersDTO>) => {
    expect(searchStore.getFilter(url)).toStrictEqual(currentFilter)
  }
})
