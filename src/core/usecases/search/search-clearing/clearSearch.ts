import { useSearchStore } from '@store/searchStore'

export const clearSearch = (key: string): void => {
  const searchStore = useSearchStore()
  searchStore.clear(key)
  searchStore.setFilter(key, undefined)
  searchStore.setError(key, undefined)
  searchStore.endLoading(key)
}
