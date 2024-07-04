import { createPinia, setActivePinia } from 'pinia'
import { useSearchStore } from '@store/searchStore'
import { searchProducts } from '@core/usecases/product/product-searching/searchProducts'
import {
  calmosine,
  chamomilla,
  dolodent,
  hemoclar
} from '@utils/testData/products'
import { FakeSearchGateway } from '@adapters/secondary/search-gateways/FakeSearchGateway'
import { baby, dents } from '@utils/testData/categories'

describe('Search products', () => {
  let searchStore: any
  let url = 'https://localhost:3000/'
  let searchGateway: FakeSearchGateway
  let query: string

  beforeEach(() => {
    setActivePinia(createPinia())
    searchStore = useSearchStore()
    searchGateway = new FakeSearchGateway()
  })

  describe('There is no filters', () => {
    beforeEach(async () => {
      query = ''
      await whenSearchForProducts(query)
    })
    it('should return an empty array', async () => {
      expectSearchResultToEqual()
    })
    it('should save the search', () => {
      expectCurrentFilterToBe(query)
    })
  })

  describe('Other urls', () => {
    beforeEach(async () => {
      url = 'https://another-url.com/'
      query = ''
      await whenSearchForProducts(query)
    })
    it('should save the result for another url', () => {
      expectSearchResultToEqual()
    })
    it('should save the search for another url', () => {
      expectCurrentFilterToBe(query)
    })
  })

  describe('There is some filters', () => {
    describe('Save current filter', () => {
      it('should save a filter', async () => {
        query = 'dol'
        await whenSearchForProducts(query)
        expectCurrentFilterToBe(query)
      })
      it('should save another filter', async () => {
        query = 'another-filter'
        await whenSearchForProducts(query)
        expectCurrentFilterToBe(query)
      })
    })
    describe('Filter on name', () => {
      beforeEach(() => {
        searchGateway.feedWith(dolodent, chamomilla, calmosine)
      })
      it('should get one product with name containing the query', async () => {
        query = 'dol'
        await whenSearchForProducts(query)
        expectSearchResultToEqual(dolodent)
      })
      it('should get multiple products with name containing the query', async () => {
        query = 'mo'
        await whenSearchForProducts(query)
        expectSearchResultToEqual(chamomilla, calmosine)
      })
      it('should get nothing with name not containing the query', async () => {
        query = 'querywithoutresult'
        await whenSearchForProducts(query)
        expectSearchResultToEqual()
      })
    })
    describe('Filter on laboratory', () => {
      beforeEach(() => {
        searchGateway.feedWith(dolodent, hemoclar, calmosine)
      })
      it('should get one product with laboratory containing the query', async () => {
        query = 'gilbe'
        await whenSearchForProducts(query)
        expectSearchResultToEqual(dolodent)
      })
      it('should get multiple products with name containing the query', async () => {
        query = 'saN'
        await whenSearchForProducts(query)
        expectSearchResultToEqual(hemoclar, calmosine)
      })
      it('should get nothing with name not containing the query', async () => {
        query = 'querywithoutresult'
        await whenSearchForProducts(query)
        expectSearchResultToEqual()
      })
    })
    describe('Filter on category name', () => {
      beforeEach(() => {
        searchGateway.feedWith(dolodent, hemoclar, calmosine, dents, baby)
      })
      it('should get one product with category name containing the query', async () => {
        query = 'dents'
        await whenSearchForProducts(query)
        expectSearchResultToEqual(dolodent)
      })
      it('should get multiple products with category name containing the query', async () => {
        query = 'béb'
        await whenSearchForProducts(query)
        expectSearchResultToEqual(hemoclar, calmosine)
      })
      it('should get nothing with category name not containing the query', async () => {
        query = 'querywithoutresult'
        await whenSearchForProducts(query)
        expectSearchResultToEqual()
      })
    })
    describe('Filter on cip13', () => {
      beforeEach(() => {
        searchGateway.feedWith(dolodent, hemoclar, calmosine, dents, baby)
      })
      it('should get one product with cip13 containing the query', async () => {
        query = dolodent.cip13
        await whenSearchForProducts(query)
        expectSearchResultToEqual(dolodent)
      })
      it('should get multiple products with category name containing the query', async () => {
        query = '123'
        await whenSearchForProducts(query)
        expectSearchResultToEqual(hemoclar, calmosine)
      })
      it('should get nothing with name not containing the query', async () => {
        query = 'querywithoutresult'
        await whenSearchForProducts(query)
        expectSearchResultToEqual()
      })
    })
  })

  const whenSearchForProducts = async (query: string) => {
    await searchProducts(url, query, searchGateway)
  }

  const expectSearchResultToEqual = (...expectedRes: Array<any>) => {
    expect(searchStore.get(url)).toStrictEqual(expectedRes)
  }

  const expectCurrentFilterToBe = (currentFilter) => {
    expect(searchStore.getFilter(url)).toBe(currentFilter)
  }
})
