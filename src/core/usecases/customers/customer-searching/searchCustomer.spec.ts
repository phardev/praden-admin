import { FakeSearchGateway } from '@adapters/secondary/search-gateways/FakeSearchGateway'
import {
  searchCustomers,
  SearchCustomersDTO
} from '@core/usecases/customers/customer-searching/searchCustomer'
import { createPinia, setActivePinia } from 'pinia'
import { useSearchStore } from '@store/searchStore'
import {
  elodieDurand,
  lucasLefevre,
  sophieMartinez
} from '@utils/testData/customers'
import { Customer } from '@core/entities/customer'
import { useCustomerStore } from '@store/customerStore'

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

  const givenExistingCustomers = (...customers: Array<Customer>) => {
    const customerStore = useCustomerStore()
    customerStore.items = customers
  }

  const whenSearchForCustomers = async (dto: Partial<SearchCustomersDTO>) => {
    await searchCustomers(url, dto, searchGateway)
  }

  const expectSearchResultToEqual = (...expectedRes: Array<any>) => {
    expect(searchStore.get(url)).toStrictEqual(expectedRes)
  }

  const expectCurrentFilterToBe = (currentFilter) => {
    expect(searchStore.getFilter(url)).toStrictEqual(currentFilter)
  }
})
