import { RoleGateway } from '@core/gateways/roleGateway'
import { listRoles } from '@core/usecases/roles/listRoles'
import { useRoleStore } from '@store/roleStore'
import { adminRole, assistantRole, pharmacistRole } from '@utils/testData/roles'
import { createPinia, setActivePinia } from 'pinia'

describe('List roles usecase', () => {
  let roleStore: any
  let roleGateway: RoleGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    roleStore = useRoleStore()
    roleGateway = {
      list: vi.fn()
    }
  })

  describe('There are roles to fetch', () => {
    beforeEach(() => {
      vi.mocked(roleGateway.list).mockResolvedValue([
        adminRole,
        pharmacistRole,
        assistantRole
      ])
    })

    it('should list all roles in the store', async () => {
      await listRoles(roleGateway)
      expect(roleStore.items).toStrictEqual([
        adminRole,
        pharmacistRole,
        assistantRole
      ])
    })

    it('should handle loading state', async () => {
      expect(roleStore.isLoading).toBe(false)
      const promise = listRoles(roleGateway)
      expect(roleStore.isLoading).toBe(true)
      await promise
      expect(roleStore.isLoading).toBe(false)
    })
  })

  describe('Gateway throws an error', () => {
    beforeEach(() => {
      vi.mocked(roleGateway.list).mockRejectedValue(new Error('Network error'))
    })

    it('should stop loading even if an error occurs', async () => {
      expect(roleStore.isLoading).toBe(false)
      try {
        await listRoles(roleGateway)
      } catch {
        // Expected to throw
      }
      expect(roleStore.isLoading).toBe(false)
    })
  })
})
