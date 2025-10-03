import { createPinia, setActivePinia } from 'pinia'
import {
  roleFormCreateVM,
  RoleFormCreateVM
} from '@adapters/primary/view-models/roles/role-form/roleFormCreateVM'
import { PermissionResource } from '@core/entities/permissionResource'
import { CreateRoleDTO } from '@core/gateways/roleGateway'

describe('RoleFormCreateVM', () => {
  let vm: RoleFormCreateVM
  const formKey = 'test-role-form'

  beforeEach(() => {
    setActivePinia(createPinia())
    vm = roleFormCreateVM(formKey)
  })

  describe('Form initialization', () => {
    const expectedNameField = {
      value: '',
      canEdit: true
    }

    it('should initialize with empty name field', () => {
      expect(vm.get('name')).toStrictEqual(expectedNameField)
    })

    it('should initialize with no permissions selected', () => {
      const permissions = vm.getAvailablePermissions()
      expect(permissions.every((p) => !p.selected)).toBe(true)
    })

    it('should have all available permission resources', () => {
      const permissions = vm.getAvailablePermissions()
      const expectedResourceCount = Object.values(PermissionResource).length
      expect(permissions).toHaveLength(expectedResourceCount)
    })
  })

  describe('Name management', () => {
    describe.each([
      { description: 'valid name', value: 'Test Role', expected: 'Test Role' },
      { description: 'empty name', value: '', expected: '' }
    ])('Name field updates', ({ description, value, expected }) => {
      const expectedField = {
        value: expected,
        canEdit: true
      }

      it(`should handle ${description}`, () => {
        vm.set('name', value)
        expect(vm.get('name')).toStrictEqual(expectedField)
      })
    })
  })

  describe('Permission management', () => {
    describe('Single permission toggle', () => {
      beforeEach(() => {
        vm.togglePermission(PermissionResource.DASHBOARD)
      })

      it('should select permission', () => {
        const permissions = vm.getAvailablePermissions()
        const dashboardPermission = permissions.find(
          (p) => p.resource === PermissionResource.DASHBOARD
        )
        expect(dashboardPermission?.selected).toBe(true)
      })
    })

    describe('Double permission toggle', () => {
      beforeEach(() => {
        vm.togglePermission(PermissionResource.DASHBOARD)
        vm.togglePermission(PermissionResource.DASHBOARD)
      })

      it('should unselect permission', () => {
        const permissions = vm.getAvailablePermissions()
        const dashboardPermission = permissions.find(
          (p) => p.resource === PermissionResource.DASHBOARD
        )
        expect(dashboardPermission?.selected).toBe(false)
      })
    })

    describe('Multiple permission selections', () => {
      beforeEach(() => {
        vm.togglePermission(PermissionResource.DASHBOARD)
        vm.togglePermission(PermissionResource.ORDERS)
        vm.togglePermission(PermissionResource.CUSTOMERS)
      })

      it('should select multiple permissions', () => {
        const permissions = vm.getAvailablePermissions()
        const selectedPermissions = permissions.filter((p) => p.selected)
        expect(selectedPermissions).toHaveLength(3)
      })
    })
  })

  describe('Form validation', () => {
    describe.each([
      {
        description: 'empty name with permissions',
        setup: () => {
          vm.set('name', '')
          vm.togglePermission(PermissionResource.DASHBOARD)
        },
        expected: false
      },
      {
        description: 'valid name without permissions',
        setup: () => vm.set('name', 'Test Role'),
        expected: false
      },
      {
        description: 'valid name with permissions',
        setup: () => {
          vm.set('name', 'Test Role')
          vm.togglePermission(PermissionResource.DASHBOARD)
        },
        expected: true
      },
      {
        description: 'whitespace-only name with permissions',
        setup: () => {
          vm.set('name', '   ')
          vm.togglePermission(PermissionResource.DASHBOARD)
        },
        expected: false
      }
    ])('Validation scenarios', ({ description, setup, expected }) => {
      it(`should be ${
        expected ? 'valid' : 'invalid'
      } with ${description}`, () => {
        setup()
        expect(vm.getCanValidate()).toBe(expected)
      })
    })
  })

  describe('DTO generation', () => {
    describe.each([
      {
        description: 'multiple permissions',
        setup: () => {
          vm.set('name', 'Manager Role')
          vm.togglePermission(PermissionResource.DASHBOARD)
          vm.togglePermission(PermissionResource.ORDERS)
        },
        expected: {
          name: 'Manager Role',
          permissions: [
            { resource: PermissionResource.DASHBOARD },
            { resource: PermissionResource.ORDERS }
          ]
        }
      },
      {
        description: 'single permission',
        setup: () => {
          vm.set('name', 'Basic Role')
          vm.togglePermission(PermissionResource.DASHBOARD)
        },
        expected: {
          name: 'Basic Role',
          permissions: [{ resource: PermissionResource.DASHBOARD }]
        }
      }
    ])('DTO scenarios', ({ description, setup, expected }) => {
      it(`should generate correct DTO with ${description}`, () => {
        setup()
        const expectedDto: CreateRoleDTO = expected
        expect(vm.getDto()).toStrictEqual(expectedDto)
      })
    })
  })

  describe('Permission labels', () => {
    it('should have French labels for all permissions', () => {
      const permissions = vm.getAvailablePermissions()
      const allHaveLabels = permissions.every(
        (permission) => permission.label && permission.label.length > 0
      )
      expect(allHaveLabels).toBe(true)
    })

    it('should have specific label for dashboard permission', () => {
      const permissions = vm.getAvailablePermissions()
      const dashboardPermission = permissions.find(
        (p) => p.resource === PermissionResource.DASHBOARD
      )
      expect(dashboardPermission?.label).toBe('Tableau de bord')
    })
  })
})
