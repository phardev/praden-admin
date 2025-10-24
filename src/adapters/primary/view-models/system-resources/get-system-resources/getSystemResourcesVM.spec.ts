import { getSystemResourcesVM } from '@adapters/primary/view-models/system-resources/get-system-resources/getSystemResourcesVM'
import { useSystemResourceStore } from '@store/systemResourceStore'
import { systemResources } from '@utils/testData/systemResources'
import { createPinia, setActivePinia } from 'pinia'

describe('Get system resources view model', () => {
  let systemResourceStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    systemResourceStore = useSystemResourceStore()
  })

  describe('There are system resources in the store', () => {
    beforeEach(() => {
      systemResourceStore.list(systemResources)
    })

    it('should return all system resources in view model format', () => {
      const result = getSystemResourcesVM()
      expect(result.items).toStrictEqual(systemResources)
    })

    it('should return loading state from store', () => {
      systemResourceStore.startLoading()
      const result = getSystemResourcesVM()
      expect(result.isLoading).toBe(true)
    })
  })

  describe('There are no system resources in the store', () => {
    it('should return empty array', () => {
      const result = getSystemResourcesVM()
      expect(result.items).toStrictEqual([])
    })

    it('should return loading state as false', () => {
      const result = getSystemResourcesVM()
      expect(result.isLoading).toBe(false)
    })
  })
})
