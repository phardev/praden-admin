import { FakeSearchGateway } from '@adapters/secondary/search-gateways/FakeSearchGateway'
import { ProductStatus } from '@core/entities/product'
import {
  SearchProductsFilters,
  searchProducts
} from '@core/usecases/product/product-searching/searchProducts'
import { useSearchStore } from '@store/searchStore'
import { baby, dents } from '@utils/testData/categories'
import {
  calmosine,
  chamomilla,
  dolodent,
  hemoclar,
  productWithoutLaboratory,
  ultraLevure
} from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'

describe('Search products', () => {
  let searchStore: any
  let url = 'https://localhost:3000/'
  let searchGateway: FakeSearchGateway
  let filters: SearchProductsFilters

  beforeEach(() => {
    setActivePinia(createPinia())
    searchStore = useSearchStore()
    searchGateway = new FakeSearchGateway()
    filters = {}
  })

  describe('There is no filters', () => {
    beforeEach(async () => {
      await whenSearchForProducts()
    })
    it('should not set search results', async () => {
      expectSearchResultToBeUndefined()
    })
    it('should save the search', () => {
      expectCurrentFiltersToEqual({})
    })
    it('should not have error', () => {
      expectErrorToBe(undefined)
    })
  })

  describe('Other urls', () => {
    beforeEach(async () => {
      url = 'https://another-url.com/'
      await whenSearchForProducts()
    })
    it('should not set search results for another url', () => {
      expectSearchResultToBeUndefined()
    })
    it('should save the search for another url', () => {
      expectCurrentFiltersToEqual({})
    })
    it('should not have error', () => {
      expectErrorToBe(undefined)
    })
  })

  describe('There is some filters', () => {
    describe('Save current filter', () => {
      it('should save a filter', async () => {
        givenQueryIs('dol')
        givenStatusFilterIs(ProductStatus.Active)
        await whenSearchForProducts()
        expectCurrentFiltersToEqual({
          query: 'dol',
          status: ProductStatus.Active
        })
      })
      it('should save another filter', async () => {
        givenQueryIs('another-filter')
        givenStatusFilterIs(ProductStatus.Inactive)
        await whenSearchForProducts()
        expectCurrentFiltersToEqual({
          query: 'another-filter',
          status: ProductStatus.Inactive
        })
      })
    })
    describe('Query filter', () => {
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
          searchGateway.feedWith(
            dolodent,
            hemoclar,
            calmosine,
            productWithoutLaboratory
          )
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
      describe('Filter on ean13', () => {
        beforeEach(() => {
          searchGateway.feedWith(dolodent, hemoclar, calmosine, dents, baby)
        })
        it('should get one product with ean13 containing the query', async () => {
          givenQueryIs(dolodent.ean13)
          await whenSearchForProducts()
          expectSearchResultToEqual(dolodent)
        })
        it('should get multiple products with ean13 containing the query', async () => {
          givenQueryIs('123')
          await whenSearchForProducts()
          expectSearchResultToEqual(hemoclar, calmosine)
        })
        it('should get nothing with ean13 not containing the query', async () => {
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
            expectSearchResultToBeEmpty()
          })
          it('should save the search query', () => {
            expectCurrentFiltersToEqual({
              query: 'do',
              minimumQueryLength: 3
            })
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
            expectSearchResultToBeEmpty()
          })
          it('should save the search query', () => {
            expectCurrentFiltersToEqual({
              query: 'do',
              minimumQueryLength: 3
            })
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
            expectCurrentFiltersToEqual({
              query: 'dol',
              minimumQueryLength: 3
            })
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
        it('should not have error', () => {
          expectErrorToBe(undefined)
        })
        it('should clear search results to show all products', () => {
          expectSearchResultToBeUndefined()
        })
        it('should save the search query', () => {
          expectCurrentFiltersToEqual({
            query: ''
          })
        })
      })
    })
    describe('Status filter', () => {
      beforeEach(() => {
        searchGateway.feedWith(dolodent, ultraLevure, chamomilla)
      })
      describe('Active products', () => {
        beforeEach(async () => {
          givenStatusFilterIs(ProductStatus.Active)
          await whenSearchForProducts()
        })
        it('should get all active products', () => {
          expectSearchResultToEqual(dolodent, chamomilla)
        })
      })
      describe('Inactive products', () => {
        beforeEach(async () => {
          givenStatusFilterIs(ProductStatus.Inactive)
          await whenSearchForProducts()
        })
        it('should get all active products', () => {
          expectSearchResultToEqual(ultraLevure)
        })
      })
    })
  })

  describe('Loading state', () => {
    beforeEach(() => {
      searchGateway.feedWith(dolodent, chamomilla)
    })

    it('should set loading to true at start of search', () => {
      givenQueryIs('dol')
      const promise = whenSearchForProducts()
      expectLoadingToBe(true)
      return promise
    })

    it('should set loading to false after search completes', async () => {
      givenQueryIs('dol')
      await whenSearchForProducts()
      expectLoadingToBe(false)
    })

    it('should set loading to false when query is too short', async () => {
      givenQueryIs('do')
      givenMinimumQueryLength(3)
      await whenSearchForProducts()
      expectLoadingToBe(false)
    })

    it('should set loading to false when query is empty', async () => {
      givenQueryIs('')
      await whenSearchForProducts()
      expectLoadingToBe(false)
    })
  })

  describe('Pagination', () => {
    beforeEach(() => {
      searchGateway.feedWith(dolodent, chamomilla, calmosine)
    })

    describe('Initial search (from=0)', () => {
      it('should replace items with search results', async () => {
        givenQueryIs('mo')
        givenSizeIs(1)
        givenFromIs(0)
        await whenSearchForProducts()
        expectSearchResultToEqual(chamomilla)
      })
      it('should set pagination with hasMore true when more results exist', async () => {
        givenQueryIs('mo')
        givenSizeIs(1)
        givenFromIs(0)
        await whenSearchForProducts()
        expectHasMoreToBe(true)
      })
    })

    describe('Subsequent search (from>0) appends items', () => {
      it('should append items when from is greater than 0', async () => {
        givenQueryIs('mo')
        givenSizeIs(1)
        givenFromIs(0)
        await whenSearchForProducts()
        givenFromIs(1)
        await whenSearchForProducts()
        expectSearchResultToEqual(chamomilla, calmosine)
      })
      it('should set hasMore false when no more results', async () => {
        givenQueryIs('mo')
        givenSizeIs(1)
        givenFromIs(0)
        await whenSearchForProducts()
        givenFromIs(1)
        await whenSearchForProducts()
        expectHasMoreToBe(false)
      })
    })

    describe('Query change resets pagination', () => {
      it('should replace items when query changes', async () => {
        givenQueryIs('mo')
        givenSizeIs(1)
        givenFromIs(0)
        await whenSearchForProducts()
        givenQueryIs('dol')
        givenFromIs(0)
        await whenSearchForProducts()
        expectSearchResultToEqual(dolodent)
      })
    })

    describe('Empty results', () => {
      it('should set hasMore false when no results', async () => {
        givenQueryIs('nonexistent')
        givenSizeIs(25)
        givenFromIs(0)
        await whenSearchForProducts()
        expectHasMoreToBe(false)
      })
    })
  })

  const givenQueryIs = (q: string) => {
    filters.query = q
  }

  const givenStatusFilterIs = (status: ProductStatus) => {
    filters.status = status
  }

  const givenMinimumQueryLength = (length: number) => {
    filters.minimumQueryLength = length
  }

  const givenSizeIs = (size: number) => {
    filters.size = size
  }

  const givenFromIs = (from: number) => {
    filters.from = from
  }

  const whenSearchForProducts = async () => {
    await searchProducts(url, filters, searchGateway)
  }

  const expectSearchResultToEqual = (...expectedRes: Array<any>) => {
    expect(searchStore.get(url)).toStrictEqual(expectedRes)
  }

  const expectSearchResultToBeEmpty = () => {
    expect(searchStore.get(url)).toStrictEqual([])
  }

  const expectCurrentFiltersToEqual = (
    currentFilters: SearchProductsFilters | undefined
  ) => {
    expect(searchStore.getFilter(url)).toStrictEqual(currentFilters)
  }

  const expectErrorToBe = (expected: string | undefined) => {
    expect(searchStore.getError(url)).toStrictEqual(expected)
  }

  const expectLoadingToBe = (expected: boolean) => {
    expect(searchStore.isLoading(url)).toBe(expected)
  }

  const expectSearchResultToBeUndefined = () => {
    expect(searchStore.get(url)).toBeUndefined()
  }

  const expectHasMoreToBe = (expected: boolean) => {
    expect(searchStore.hasMoreSearch(url)).toBe(expected)
  }
})
