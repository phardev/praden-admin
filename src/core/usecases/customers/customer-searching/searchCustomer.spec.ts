import { FakeSearchGateway } from '@adapters/secondary/search-gateways/FakeSearchGateway'
import { Customer } from '@core/entities/customer'
import {
  SearchCustomersDTO,
  searchCustomers
} from '@core/usecases/customers/customer-searching/searchCustomer'
import { useCustomerStore } from '@store/customerStore'
import { SearchPagination, useSearchStore } from '@store/searchStore'
import {
  elodieDurand,
  lucasLefevre,
  sophieMartinez
} from '@utils/testData/customers'
import { createPinia, setActivePinia } from 'pinia'

describe('Customer searching', () => {
  let searchStore: any
  const url = 'https://localhost:3000/'
  let searchGateway: FakeSearchGateway
  let dto: SearchCustomersDTO

  beforeEach(() => {
    setActivePinia(createPinia())
    searchStore = useSearchStore()
    searchGateway = new FakeSearchGateway()
    dto = {}
  })

  describe('There is no filters', () => {
    beforeEach(async () => {
      dto.query = ''
      await whenSearchForCustomers(dto)
    })
    it('should return an empty array', async () => {
      expectSearchResultToEqual()
    })
    it('should save the search', () => {
      expectCurrentFilterToBe(dto)
    })
  })
  describe('Filter first name', () => {
    beforeEach(() => {
      givenExistingCustomers(elodieDurand, lucasLefevre, sophieMartinez)
    })
    it('should get customer with firstname containing the query', async () => {
      dto.query = 'Elodi'
      await whenSearchForCustomers(dto)
      expectSearchResultToEqual(elodieDurand)
    })
    it('should get another customer with firstname containing the query', async () => {
      dto.query = 'SoPhi'
      await whenSearchForCustomers(dto)
      expectSearchResultToEqual(sophieMartinez)
    })
    it('should get another customer with firstname containing the query with accents', async () => {
      dto.query = 'elod'
      await whenSearchForCustomers(dto)
      expectSearchResultToEqual(elodieDurand)
    })
    it('should get nothing with firstname not containing the query', async () => {
      dto.query = 'querywithoutresult'
      await whenSearchForCustomers(dto)
      expectSearchResultToEqual()
    })
  })

  describe('Filter last name', () => {
    beforeEach(() => {
      givenExistingCustomers(elodieDurand, lucasLefevre, sophieMartinez)
    })
    it('should get one customer with lastname containing the query', async () => {
      dto.query = 'and'
      await whenSearchForCustomers(dto)
      expectSearchResultToEqual(elodieDurand)
    })
    it('should get another customer with lastname containing the query without the accents', async () => {
      dto.query = 'leFe'
      await whenSearchForCustomers(dto)
      expectSearchResultToEqual(lucasLefevre)
    })
    it('should get nothing with lastname not containing the query', async () => {
      dto.query = 'querywithoutresult'
      await whenSearchForCustomers(dto)
      expectSearchResultToEqual()
    })
  })

  describe('Filter email', () => {
    beforeEach(() => {
      givenExistingCustomers(elodieDurand, lucasLefevre, sophieMartinez)
    })
    it('should get one customer with email containing the query', async () => {
      dto.query = '@exampl'
      await whenSearchForCustomers(dto)
      expectSearchResultToEqual(elodieDurand, lucasLefevre, sophieMartinez)
    })
    it('should get another customer with email containing the query', async () => {
      dto.query = 'lucas.lefevre@ex'
      await whenSearchForCustomers(dto)
      expectSearchResultToEqual(lucasLefevre)
    })
    it('should get nothing with email not containing the query', async () => {
      dto.query = 'querywithoutresult'
      await whenSearchForCustomers(dto)
      expectSearchResultToEqual()
    })
  })

  describe('Filter phone', () => {
    beforeEach(() => {
      givenExistingCustomers(elodieDurand, lucasLefevre, sophieMartinez)
    })
    it('should get one customer with phone containing the query', async () => {
      dto.query = '5678'
      await whenSearchForCustomers(dto)
      expectSearchResultToEqual(elodieDurand)
    })
    it('should get another customer with phone containing the query', async () => {
      dto.query = '7654'
      await whenSearchForCustomers(dto)
      expectSearchResultToEqual(lucasLefevre, sophieMartinez)
    })
    it('should get nothing with phone not containing the query', async () => {
      dto.query = '49287543987'
      await whenSearchForCustomers(dto)
      expectSearchResultToEqual()
    })
  })
  describe('Filter last order date', () => {
    beforeEach(() => {
      givenExistingCustomers(elodieDurand, lucasLefevre, sophieMartinez)
    })
    it('should get customers whose last order is on or after the start date', async () => {
      dto.lastOrderStartDate = lastOrderTimestampOf(elodieDurand)
      await whenSearchForCustomers(dto)
      expectSearchResultToEqual(elodieDurand)
    })
    it('should get customers whose last order is on or before the end date', async () => {
      dto.lastOrderEndDate = lastOrderTimestampOf(lucasLefevre)
      await whenSearchForCustomers(dto)
      expectSearchResultToEqual(lucasLefevre)
    })
    it('should not get customers without any order', async () => {
      dto.lastOrderStartDate = lastOrderTimestampOf(lucasLefevre)
      dto.lastOrderEndDate = lastOrderTimestampOf(elodieDurand)
      await whenSearchForCustomers(dto)
      expectSearchResultToEqual(elodieDurand, lucasLefevre)
    })
  })

  describe('Filter orders count', () => {
    beforeEach(() => {
      givenExistingCustomers(elodieDurand, lucasLefevre, sophieMartinez)
    })
    it('should get customers with at least the minimum orders count', async () => {
      dto.minOrdersCount = elodieDurand.ordersCount
      await whenSearchForCustomers(dto)
      expectSearchResultToEqual(elodieDurand)
    })
    it('should get customers with at most the maximum orders count', async () => {
      dto.maxOrdersCount = lucasLefevre.ordersCount
      await whenSearchForCustomers(dto)
      expectSearchResultToEqual(lucasLefevre, sophieMartinez)
    })
    it('should get customers who never ordered', async () => {
      dto.maxOrdersCount = 0
      await whenSearchForCustomers(dto)
      expectSearchResultToEqual(sophieMartinez)
    })
  })

  describe('Filter newsletter subscription', () => {
    beforeEach(() => {
      givenExistingCustomers(elodieDurand, lucasLefevre, sophieMartinez)
    })
    it('should get subscribed customers', async () => {
      dto.newsletterSubscribed = true
      await whenSearchForCustomers(dto)
      expectSearchResultToEqual(elodieDurand)
    })
    it('should get not subscribed customers', async () => {
      dto.newsletterSubscribed = false
      await whenSearchForCustomers(dto)
      expectSearchResultToEqual(lucasLefevre, sophieMartinez)
    })
  })

  describe('Filters combined with a query', () => {
    beforeEach(async () => {
      givenExistingCustomers(elodieDurand, lucasLefevre, sophieMartinez)
      dto.query = '@exampl'
      dto.newsletterSubscribed = false
      dto.minOrdersCount = lucasLefevre.ordersCount
      await whenSearchForCustomers(dto)
    })
    it('should get customers matching every filter', () => {
      expectSearchResultToEqual(lucasLefevre)
    })
  })

  describe('Pagination', () => {
    const size = 2
    beforeEach(() => {
      givenExistingCustomers(elodieDurand, lucasLefevre, sophieMartinez)
      dto.newsletterSubscribed = undefined
      dto.size = size
    })
    describe('First page is full', () => {
      beforeEach(async () => {
        dto.from = 0
        await whenSearchForCustomers(dto)
      })
      it('should get the first page', () => {
        expectSearchResultToEqual(elodieDurand, lucasLefevre)
      })
      it('should have more results', () => {
        expectPaginationToBe({ total: size, from: 0, hasMore: true })
      })
    })
    describe('Next page is not full', () => {
      beforeEach(async () => {
        dto.from = 0
        await whenSearchForCustomers(dto)
        await whenSearchForCustomers({ ...dto, from: size })
      })
      it('should append the next page', () => {
        expectSearchResultToEqual(elodieDurand, lucasLefevre, sophieMartinez)
      })
      it('should not have more results', () => {
        expectPaginationToBe({ total: size + 1, from: size, hasMore: false })
      })
    })
  })

  describe('Query length', () => {
    describe('The query is not long enough', () => {
      beforeEach(async () => {
        dto.query = '76'
        dto.minimumQueryLength = 3
        await whenSearchForCustomers(dto)
      })
      it('should have an error', () => {
        expectErrorToBe('query is too short')
      })
      it('should not have a result', () => {
        expectSearchResultToBeEmpty()
      })
      it('should save the search query', () => {
        expectCurrentFilterToBe({
          query: '76',
          minimumQueryLength: 3
        })
      })
      it('should not be loading', () => {
        expectLoadingToBe(false)
      })
    })
  })

  describe('Loading state', () => {
    describe('The search is in progress', () => {
      it('should be loading', () => {
        dto.query = 'Elodi'
        const search = whenSearchForCustomers(dto)
        expectLoadingToBe(true)
        return search
      })
    })
    describe('The search is done', () => {
      beforeEach(async () => {
        dto.query = 'Elodi'
        await whenSearchForCustomers(dto)
      })
      it('should not be loading anymore', () => {
        expectLoadingToBe(false)
      })
    })
    describe('The search succeeds after an error', () => {
      beforeEach(async () => {
        dto.query = '76'
        dto.minimumQueryLength = 3
        await whenSearchForCustomers(dto)
        dto.query = 'Elodi'
        await whenSearchForCustomers(dto)
      })
      it('should clear the error', () => {
        expectErrorToBe(undefined)
      })
    })
  })

  const givenExistingCustomers = (...customers: Array<Customer>) => {
    const customerStore = useCustomerStore()
    customerStore.items = customers
  }

  const lastOrderTimestampOf = (customer: Customer): number =>
    new Date(customer.lastOrderDate!).getTime()

  const whenSearchForCustomers = async (dto: Partial<SearchCustomersDTO>) => {
    await searchCustomers(url, dto, searchGateway)
  }

  const expectSearchResultToEqual = (...expectedRes: Array<any>) => {
    expect(searchStore.get(url)).toStrictEqual(expectedRes)
  }

  const expectCurrentFilterToBe = (
    currentFilter: Partial<SearchCustomersDTO>
  ) => {
    expect(searchStore.getFilter(url)).toStrictEqual(currentFilter)
  }

  const expectPaginationToBe = (expected: SearchPagination) => {
    expect(searchStore.getPagination(url)).toStrictEqual(expected)
  }

  const expectSearchResultToBeEmpty = () => {
    expect(searchStore.get(url)).toStrictEqual([])
  }

  const expectErrorToBe = (expected: string | undefined) => {
    expect(searchStore.getError(url)).toStrictEqual(expected)
  }

  const expectLoadingToBe = (expected: boolean) => {
    expect(searchStore.isLoading(url)).toStrictEqual(expected)
  }
})
