import { useSearchStore } from '@store/searchStore'
import { orderToPrepare1 } from '@utils/testData/orders'
import { createPinia, setActivePinia } from 'pinia'
import { clearSearch } from './clearSearch'

describe('Clear search', () => {
  let searchStore: ReturnType<typeof useSearchStore>
  const namespace = 'assistance-subject-orders'
  const otherNamespace = 'orders'

  beforeEach(() => {
    setActivePinia(createPinia())
    searchStore = useSearchStore()
  })

  describe('Given a search was made in the namespace', () => {
    beforeEach(() => {
      givenSearchState(namespace)
      givenSearchState(otherNamespace)
      clearSearch(namespace)
    })

    it('should forget the items', () => {
      expect(searchStore.get(namespace)).toBeUndefined()
    })

    it('should forget the filter', () => {
      expect(searchStore.getFilter(namespace)).toBeUndefined()
    })

    it('should forget the error', () => {
      expect(searchStore.getError(namespace)).toBeUndefined()
    })

    it('should forget the pagination', () => {
      expect(searchStore.getPagination(namespace)).toBeUndefined()
    })

    it('should not be loading', () => {
      expect(searchStore.isLoading(namespace)).toBe(false)
    })

    it('should keep the other namespaces untouched', () => {
      expect(searchStore.get(otherNamespace)).toStrictEqual([orderToPrepare1])
    })
  })

  const givenSearchState = (key: string) => {
    searchStore.set(key, [orderToPrepare1])
    searchStore.setFilter(key, { query: 'jo' })
    searchStore.setError(key, 'query is too short')
    searchStore.setPagination(key, { total: 1, from: 0, hasMore: false })
    searchStore.startLoading(key)
  }
})
