import {
  permissionMatrixEditVM,
  PermissionMatrixEditVM,
  EditRoleChangeDto
} from './permissionMatrixEditVM'

describe('PermissionMatrixEditVM', () => {
  let vm: PermissionMatrixEditVM
  let initialPermissions: Record<string, Record<string, boolean>>
  let roles: Array<{ uuid: string; name: string }>

  beforeEach(() => {
    roles = [
      { uuid: 'role-admin', name: 'Administrateur' },
      { uuid: 'role-pharmacist', name: 'Pharmacien' },
      { uuid: 'role-assistant', name: 'Assistant' }
    ]

    initialPermissions = {
      'role-admin': {
        dashboard: true,
        newsletter: true,
        administration: true,
        'user-management': false
      },
      'role-pharmacist': {
        dashboard: true,
        newsletter: false,
        administration: false,
        'user-management': true
      },
      'role-assistant': {
        dashboard: true,
        newsletter: false,
        administration: false,
        'user-management': false
      }
    }

    vm = permissionMatrixEditVM(initialPermissions, roles)
  })

  describe('Initial state', () => {
    it('should return initial permission values', () => {
      expect(vm.getPermission('role-admin', 'dashboard')).toBe(true)
      expect(vm.getPermission('role-admin', 'user-management')).toBe(false)
      expect(vm.getPermission('role-pharmacist', 'newsletter')).toBe(false)
    })

    it('should have no changes initially', () => {
      expect(vm.hasChanges()).toBe(false)
    })

    it('should return empty changed roles list initially', () => {
      expect(vm.getChangedRolesDto()).toEqual([])
    })
  })

  describe('Setting permissions', () => {
    it('should update permission value', () => {
      vm.setPermission('role-admin', 'user-management', true)

      expect(vm.getPermission('role-admin', 'user-management')).toBe(true)
    })

    it('should detect changes after setting a permission', () => {
      vm.setPermission('role-admin', 'user-management', true)

      expect(vm.hasChanges()).toBe(true)
    })

    it('should handle setting permission for non-existent resource', () => {
      vm.setPermission('role-admin', 'new-resource', true)

      expect(vm.getPermission('role-admin', 'new-resource')).toBe(true)
      expect(vm.hasChanges()).toBe(true)
    })

    it('should return false for non-existent permissions', () => {
      expect(vm.getPermission('non-existent-role', 'dashboard')).toBe(false)
      expect(vm.getPermission('role-admin', 'non-existent-resource')).toBe(
        false
      )
    })
  })

  describe('Change detection', () => {
    it('should not detect changes when setting same value', () => {
      vm.setPermission('role-admin', 'dashboard', true) // Already true

      expect(vm.hasChanges()).toBe(false)
    })

    it('should detect changes when toggling permission off', () => {
      vm.setPermission('role-admin', 'dashboard', false) // Was true

      expect(vm.hasChanges()).toBe(true)
    })

    it('should detect changes when toggling permission on', () => {
      vm.setPermission('role-admin', 'user-management', true) // Was false

      expect(vm.hasChanges()).toBe(true)
    })

    it('should not detect changes after reverting to original', () => {
      vm.setPermission('role-admin', 'user-management', true)
      vm.setPermission('role-admin', 'user-management', false) // Back to original

      expect(vm.hasChanges()).toBe(false)
    })
  })

  describe('Getting changed roles DTO', () => {
    it('should return single changed role', () => {
      vm.setPermission('role-admin', 'user-management', true)

      const changes = vm.getChangedRolesDto()
      const expectedDto: Array<EditRoleChangeDto> = [
        {
          roleUuid: 'role-admin',
          roleName: 'Administrateur',
          permissions: [
            { resource: 'dashboard' },
            { resource: 'newsletter' },
            { resource: 'administration' },
            { resource: 'user-management' }
          ]
        }
      ]

      expect(changes).toEqual(expectedDto)
    })

    it('should return multiple changed roles', () => {
      vm.setPermission('role-admin', 'user-management', true)
      vm.setPermission('role-pharmacist', 'newsletter', true)

      const changes = vm.getChangedRolesDto()

      expect(changes).toHaveLength(2)
      expect(changes.some((c) => c.roleUuid === 'role-admin')).toBe(true)
      expect(changes.some((c) => c.roleUuid === 'role-pharmacist')).toBe(true)
    })

    it('should include only permissions that are true in DTO', () => {
      vm.setPermission('role-assistant', 'newsletter', true)
      vm.setPermission('role-assistant', 'administration', false) // Still false

      const changes = vm.getChangedRolesDto()
      const assistantChange = changes.find(
        (c) => c.roleUuid === 'role-assistant'
      )

      expect(assistantChange?.permissions).toEqual([
        { resource: 'dashboard' },
        { resource: 'newsletter' }
      ])
    })

    it('should return empty array when no changes', () => {
      expect(vm.getChangedRolesDto()).toEqual([])
    })

    it('should handle role removed from permissions', () => {
      vm.setPermission('role-admin', 'dashboard', false)
      vm.setPermission('role-admin', 'newsletter', false)
      vm.setPermission('role-admin', 'administration', false)

      const changes = vm.getChangedRolesDto()
      const adminChange = changes.find((c) => c.roleUuid === 'role-admin')

      expect(adminChange?.permissions).toEqual([])
    })
  })

  describe('Reset functionality', () => {
    it('should revert all changes when reset', () => {
      vm.setPermission('role-admin', 'user-management', true)
      vm.setPermission('role-pharmacist', 'newsletter', true)

      expect(vm.hasChanges()).toBe(true)

      vm.reset()

      expect(vm.hasChanges()).toBe(false)
      expect(vm.getPermission('role-admin', 'user-management')).toBe(false)
      expect(vm.getPermission('role-pharmacist', 'newsletter')).toBe(false)
    })

    it('should return empty changed roles list after reset', () => {
      vm.setPermission('role-admin', 'user-management', true)
      vm.reset()

      expect(vm.getChangedRolesDto()).toEqual([])
    })
  })

  describe('Current permissions', () => {
    it('should return deep copy of current permissions', () => {
      vm.setPermission('role-admin', 'user-management', true)

      const current = vm.getCurrentPermissions()
      current['role-admin']['dashboard'] = false // Modify returned object

      // Original should not be affected
      expect(vm.getPermission('role-admin', 'dashboard')).toBe(true)
    })
  })

  describe('Update original functionality', () => {
    it('should make current permissions the new baseline', () => {
      const vm = permissionMatrixEditVM(initialPermissions, roles)

      vm.setPermission('role-admin', 'user-management', true)
      vm.setPermission('role-pharmacist', 'newsletter', true)

      expect(vm.hasChanges()).toBe(true)

      vm.updateOriginal()

      expect(vm.hasChanges()).toBe(false)
      expect(vm.getChangedRolesDto()).toEqual([])
    })

    it('should allow new changes after updating original', () => {
      const vm = permissionMatrixEditVM(initialPermissions, roles)

      vm.setPermission('role-admin', 'user-management', true)
      vm.updateOriginal()

      expect(vm.hasChanges()).toBe(false)

      vm.setPermission('role-admin', 'newsletter', false)

      expect(vm.hasChanges()).toBe(true)
      expect(vm.getChangedRolesDto()).toHaveLength(1)
    })
  })
})
