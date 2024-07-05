import { createPinia, setActivePinia } from 'pinia'
import { useSearchStore } from '@store/searchStore'
import { FakeSearchGateway } from '@adapters/secondary/search-gateways/FakeSearchGateway'
import {
  searchOrders,
  SearchOrdersDTO
} from '@core/usecases/order/orders-searching/searchOrders'
import {
  orderInPreparation1,
  orderNotPayed1,
  orderPartiallyShipped1,
  orderPrepared1,
  orderToPrepare1,
  orderToPrepare2,
  orderToPrepare3
} from '@utils/testData/orders'
import { DeliveryStatus, Order, PaymentStatus } from '@core/entities/order'
import { useOrderStore } from '@store/orderStore'

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
          orderPartiallyShipped1
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
    describe('Apply mulitple filters in multiple steps', () => {
      it('should apply all filters', async () => {
        givenExistingOrders(
          orderToPrepare1,
          orderToPrepare2,
          orderNotPayed1,
          orderInPreparation1,
          orderPartiallyShipped1
        )
        dto.query = 'bon'
        await whenSearchForOrders(dto)
        dto.startDate = orderToPrepare1.createdAt + 1000
        await whenSearchForOrders(dto)
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

  const expectCurrentFilterToBe = (currentFilter) => {
    expect(searchStore.getFilter(url)).toStrictEqual(currentFilter)
  }
})
