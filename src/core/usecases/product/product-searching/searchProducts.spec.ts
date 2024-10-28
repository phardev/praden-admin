import { createPinia, setActivePinia } from 'pinia'
import { useSearchStore } from '@store/searchStore'
import {
  searchProducts,
  SearchProductsFilters
} from '@core/usecases/product/product-searching/searchProducts'
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
  let query: string | undefined
  let minimumQueryLength: number | undefined

  beforeEach(() => {
    setActivePinia(createPinia())
    searchStore = useSearchStore()
    searchGateway = new FakeSearchGateway()
    query = undefined
    minimumQueryLength = undefined
  })

  describe('There is no filters', () => {
    beforeEach(async () => {
      await whenSearchForProducts()
    })
    it('should return an empty array', async () => {
      expectSearchResultToBeUndefined()
    })
    it('should save the search', () => {
      expectCurrentQueryToBe(query)
    })
    it('should says that the query is too short', () => {
      expectErrorToBe(undefined)
    })
  })

  describe('Other urls', () => {
    beforeEach(async () => {
      url = 'https://another-url.com/'
      await whenSearchForProducts()
    })
    it('should save the result for another url', () => {
      expectSearchResultToBeUndefined()
    })
    it('should save the search for another url', () => {
      expectCurrentQueryToBe(query)
    })
    it('should says that the query is too short', () => {
      expectErrorToBe(undefined)
    })
  })

  describe('There is some filters', () => {
    describe('Save current filter', () => {
      it('should save a filter', async () => {
        givenQueryIs('dol')
        await whenSearchForProducts()
        expectCurrentQueryToBe(query)
      })
      it('should save another filter', async () => {
        givenQueryIs('another-filter')
        await whenSearchForProducts()
        expectCurrentQueryToBe(query)
      })
    })
    describe('Filter on name', () => {
      beforeEach(() => {
        searchGateway.feedWith(dolodent, chamomilla, calmosine)
      })
      it('should get one product with name containing the query', async () => {
        givenQueryIs('dol')
        await whenSearchForProducts()
        expectSearchResultToEqual(dolodent)
      })
      it('should get multiple products with name containing the query', async () => {
        givenQueryIs('mo')
        await whenSearchForProducts()
        expectSearchResultToEqual(chamomilla, calmosine)
      })
      it('should get nothing with name not containing the query', async () => {
        givenQueryIs('querywithoutresult')
        await whenSearchForProducts()
        expectSearchResultToEqual()
      })
    })
    describe('Filter on laboratory', () => {
      beforeEach(() => {
        searchGateway.feedWith(dolodent, hemoclar, calmosine)
      })
      it('should get one product with laboratory containing the query', async () => {
        givenQueryIs('gilbe')
        await whenSearchForProducts()
        expectSearchResultToEqual(dolodent)
      })
      it('should get multiple products with name containing the query', async () => {
        givenQueryIs('saN')
        await whenSearchForProducts()
        expectSearchResultToEqual(hemoclar, calmosine)
      })
      it('should get nothing with name not containing the query', async () => {
        givenQueryIs('querywithoutresult')
        await whenSearchForProducts()
        expectSearchResultToEqual()
      })
    })
    describe('Filter on category name', () => {
      beforeEach(() => {
        searchGateway.feedWith(dolodent, hemoclar, calmosine, dents, baby)
      })
      it('should get one product with category name containing the query', async () => {
        givenQueryIs('dents')
        await whenSearchForProducts()
        expectSearchResultToEqual(dolodent)
      })
      it('should get multiple products with category name containing the query', async () => {
        givenQueryIs('béb')
        await whenSearchForProducts()
        expectSearchResultToEqual(hemoclar, calmosine)
      })
      it('should get nothing with category name not containing the query', async () => {
        givenQueryIs('querywithoutresult')
        await whenSearchForProducts()
        expectSearchResultToEqual()
      })
    })
    describe('Filter on cip13', () => {
      beforeEach(() => {
        searchGateway.feedWith(dolodent, hemoclar, calmosine, dents, baby)
      })
      it('should get one product with cip13 containing the query', async () => {
        query = dolodent.cip13
        await whenSearchForProducts()
        expectSearchResultToEqual(dolodent)
      })
      it('should get multiple products with category name containing the query', async () => {
        givenQueryIs('123')
        await whenSearchForProducts()
        expectSearchResultToEqual(hemoclar, calmosine)
      })
      it('should get nothing with name not containing the query', async () => {
        givenQueryIs('querywithoutresult')
        await whenSearchForProducts()
        expectSearchResultToEqual()
      })
    })
    describe('Query length', () => {
      describe('The query is not long enough', () => {
        beforeEach(async () => {
          searchGateway.feedWith(dolodent, chamomilla, calmosine)
          givenQueryIs('do')
          givenMinimumQueryLength(3)
          await whenSearchForProducts()
        })
        it('should have an error', () => {
          expectErrorToBe('query is too short')
        })
        it('should not have a result', () => {
          expectSearchResultToBeUndefined()
        })
        it('should save the search query', () => {
          expectCurrentQueryToBe('do')
        })
      })
      describe('The query was good but not anymore', () => {
        beforeEach(async () => {
          searchGateway.feedWith(dolodent, chamomilla, calmosine)
          givenMinimumQueryLength(3)
          givenQueryIs('dol')
          await whenSearchForProducts()
          givenQueryIs('do')
          await whenSearchForProducts()
        })
        it('should have an error', () => {
          expectErrorToBe('query is too short')
        })
        it('should not have a result', () => {
          expectSearchResultToBeUndefined()
        })
        it('should save the search query', () => {
          expectCurrentQueryToBe('do')
        })
      })
      describe('The query was not long enough but now works', () => {
        beforeEach(async () => {
          searchGateway.feedWith(dolodent, chamomilla, calmosine)
          givenMinimumQueryLength(3)
          givenQueryIs('do')
          await whenSearchForProducts()
          givenQueryIs('dol')
          await whenSearchForProducts()
        })
        it('should not have', () => {
          expectErrorToBe(undefined)
        })
        it('should have a result', () => {
          expectSearchResultToEqual(dolodent)
        })
        it('should save the search query', () => {
          expectCurrentQueryToBe('dol')
        })
      })
    })
    describe('The query was set but is now empty', () => {
      beforeEach(async () => {
        searchGateway.feedWith(dolodent, chamomilla, calmosine)
        givenQueryIs('do')
        await whenSearchForProducts()
        givenQueryIs('')
        await whenSearchForProducts()
      })
      it('should not have', () => {
        expectErrorToBe(undefined)
      })
      it('should not have result', () => {
        expectSearchResultToBeUndefined()
      })
      it('should save the search query', () => {
        expectCurrentQueryToBe('')
      })
    })
  })

  const givenQueryIs = (q: string) => {
    query = q
  }

  const givenMinimumQueryLength = (length: number) => {
    minimumQueryLength = length
  }

  const whenSearchForProducts = async () => {
    const filters: SearchProductsFilters = {
      query,
      minimumQueryLength
    }
    await searchProducts(url, filters, searchGateway)
  }

  const expectSearchResultToEqual = (...expectedRes: Array<any>) => {
    expect(searchStore.get(url)).toStrictEqual(expectedRes)
  }

  const expectSearchResultToBeUndefined = () => {
    expect(searchStore.get(url)).toStrictEqual(undefined)
  }

  const expectCurrentQueryToBe = (currentQuery: string | undefined) => {
    expect(searchStore.getFilter(url)).toBe(currentQuery)
  }

  const expectErrorToBe = (expected: string | undefined) => {
    expect(searchStore.getError(url)).toStrictEqual(expected)
  }
})
