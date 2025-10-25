import { SystemResourceGateway } from '@core/gateways/systemResourceGateway'
import { listSystemResources } from '@core/usecases/system-resources/listSystemResources'
import { useSystemResourceStore } from '@store/systemResourceStore'
import { systemResources } from '@utils/testData/systemResources'
import { createPinia, setActivePinia } from 'pinia'

describe('List system resources usecase', () => {
  let systemResourceStore: any
  let systemResourceGateway: SystemResourceGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    systemResourceStore = useSystemResourceStore()
    systemResourceGateway = {
      list: vi.fn()
    }
  })

  describe('There are system resources to fetch', () => {
    beforeEach(() => {
      vi.mocked(systemResourceGateway.list).mockResolvedValue(systemResources)
    })

    it('should list all system resources in the store', async () => {
      await listSystemResources(systemResourceGateway)
      expect(systemResourceStore.items).toStrictEqual(systemResources)
    })

    it('should handle loading state', async () => {
      expect(systemResourceStore.isLoading).toBe(false)
      const promise = listSystemResources(systemResourceGateway)
      expect(systemResourceStore.isLoading).toBe(true)
      await promise
      expect(systemResourceStore.isLoading).toBe(false)
    })
  })

  describe('Gateway throws an error', () => {
    beforeEach(() => {
      vi.mocked(systemResourceGateway.list).mockRejectedValue(
        new Error('Network error')
      )
    })

    it('should stop loading even if an error occurs', async () => {
      expect(systemResourceStore.isLoading).toBe(false)
      try {
        await listSystemResources(systemResourceGateway)
      } catch {
        // Expected to throw
      }
      expect(systemResourceStore.isLoading).toBe(false)
    })
  })
})
