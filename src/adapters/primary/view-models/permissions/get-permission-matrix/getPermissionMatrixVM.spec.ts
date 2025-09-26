import { createPinia, setActivePinia } from 'pinia'
import { useRoleStore } from '@store/roleStore'
import { useSystemResourceStore } from '@store/systemResourceStore'
import { getPermissionMatrixVM } from '@adapters/primary/view-models/permissions/get-permission-matrix/getPermissionMatrixVM'
import { adminRole, pharmacistRole, assistantRole } from '@utils/testData/roles'
import { systemResources } from '@utils/testData/systemResources'

describe('Get permission matrix view model', () => {
  let roleStore: any
  let systemResourceStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    roleStore = useRoleStore()
    systemResourceStore = useSystemResourceStore()
  })

  describe('There are roles and system resources', () => {
    beforeEach(() => {
      roleStore.list([adminRole, pharmacistRole, assistantRole])
      systemResourceStore.list(systemResources)
    })

    it('should return permission matrix with all roles and resources', () => {
      const result = getPermissionMatrixVM()

      expect(result.systemResources).toStrictEqual(systemResources)
      expect(result.roles).toStrictEqual([
        { uuid: 'role-admin', name: 'Administrateur' },
        { uuid: 'role-pharmacist', name: 'Pharmacien' },
        { uuid: 'role-assistant', name: 'Assistant' }
      ])
    })

    it('should map permissions correctly for admin role', () => {
      const result = getPermissionMatrixVM()

      expect(result.permissions['role-admin']).toStrictEqual({
        dashboard: true,
        newsletter: true,
        administration: true,
        'user-management': true,
        reports: true,
        analytics: true,
        settings: true
      })
    })

    it('should map permissions correctly for pharmacist role', () => {
      const result = getPermissionMatrixVM()

      expect(result.permissions['role-pharmacist']).toStrictEqual({
        dashboard: true,
        newsletter: true,
        administration: false,
        'user-management': true,
        reports: true,
        analytics: true,
        settings: false
      })
    })

    it('should map permissions correctly for assistant role', () => {
      const result = getPermissionMatrixVM()

      expect(result.permissions['role-assistant']).toStrictEqual({
        dashboard: true,
        newsletter: true,
        administration: false,
        'user-management': false,
        reports: false,
        analytics: false,
        settings: false
      })
    })

    it('should return loading state from stores', () => {
      roleStore.startLoading()
      systemResourceStore.startLoading()

      const result = getPermissionMatrixVM()

      expect(result.isLoading).toBe(true)
    })
  })

  describe('There are no roles and no system resources', () => {
    it('should return empty arrays and permissions', () => {
      const result = getPermissionMatrixVM()

      expect(result.systemResources).toStrictEqual([])
      expect(result.roles).toStrictEqual([])
      expect(result.permissions).toStrictEqual({})
      expect(result.isLoading).toBe(false)
    })
  })
})
