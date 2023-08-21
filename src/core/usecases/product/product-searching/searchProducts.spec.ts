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

  beforeEach(() => {
    setActivePinia(createPinia())
    searchStore = useSearchStore()
    searchGateway = new FakeSearchGateway()
  })

  describe('There is no filters', () => {
    it('should return an empty array', async () => {
      const query = ''
      await whenSearchForProducts(query)
      expectSearchResultToEqual()
    })
  })

  describe('Other urls', () => {
    it('should save the result for another url', async () => {
      url = 'https://another-url.com/'
      const query = ''
      await whenSearchForProducts(query)
      expectSearchResultToEqual()
    })
  })

  describe('There is some filters', () => {
    describe('Filter on name', () => {
      beforeEach(() => {
        searchGateway.feedWith(dolodent, chamomilla, calmosine)
      })
      it('should get one product with name containing the query', async () => {
        const query = 'dol'
        await whenSearchForProducts(query)
        expectSearchResultToEqual(dolodent)
      })
      it('should get multiple products with name containing the query', async () => {
        const query = 'mo'
        await whenSearchForProducts(query)
        expectSearchResultToEqual(chamomilla, calmosine)
      })
      it('should get nothing with name not containing the query', async () => {
        const query = 'querywithoutresult'
        await whenSearchForProducts(query)
        expectSearchResultToEqual()
      })
    })
    describe('Filter on laboratory', () => {
      beforeEach(() => {
        searchGateway.feedWith(dolodent, hemoclar, calmosine)
      })
      it('should get one product with laboratory containing the query', async () => {
        const query = 'gilbe'
        await whenSearchForProducts(query)
        expectSearchResultToEqual(dolodent)
      })
      it('should get multiple products with name containing the query', async () => {
        const query = 'saN'
        await whenSearchForProducts(query)
        expectSearchResultToEqual(hemoclar, calmosine)
      })
      it('should get nothing with name not containing the query', async () => {
        const query = 'querywithoutresult'
        await whenSearchForProducts(query)
        expectSearchResultToEqual()
      })
    })
    describe('Filter on category name', () => {
      beforeEach(() => {
        searchGateway.feedWith(dolodent, hemoclar, calmosine, dents, baby)
      })
      it('should get one product with laboratory containing the query', async () => {
        const query = 'dents'
        await whenSearchForProducts(query)
        expectSearchResultToEqual(dolodent)
      })
      it('should get multiple products with category name containing the query', async () => {
        const query = 'béb'
        await whenSearchForProducts(query)
        expectSearchResultToEqual(hemoclar, calmosine)
      })
      it('should get nothing with name not containing the query', async () => {
        const query = 'querywithoutresult'
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
})
