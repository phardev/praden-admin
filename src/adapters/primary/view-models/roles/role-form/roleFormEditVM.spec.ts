import { createPinia, setActivePinia } from 'pinia'
import {
  roleFormEditVM,
  RoleFormEditVM
} from '@adapters/primary/view-models/roles/role-form/roleFormEditVM'
import { PermissionResource } from '@core/entities/permissionResource'
import { EditRoleDTO } from '@core/gateways/roleGateway'
import { Role } from '@core/entities/role'
import { useRoleStore } from '@store/roleStore'
import { useFormStore } from '@store/formStore'
import { adminRole, pharmacistRole } from '@utils/testData/roles'
import type { Field } from '@adapters/primary/view-models/roles/role-form/roleFormVM'

describe('RoleFormEditVM', () => {
  let vm: RoleFormEditVM
  let roleStore: any
  let formStore: any
  const formKey = 'test-role-edit-form'
  const existingRole: Role = {
    uuid: 'role-123',
    name: 'Test Manager',
    order: 3,
    permissions: [
      { resource: PermissionResource.DASHBOARD },
      { resource: PermissionResource.ORDERS },
      { resource: PermissionResource.CUSTOMERS }
    ]
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    roleStore = useRoleStore()
    formStore = useFormStore()
    roleStore.items = [adminRole, pharmacistRole, existingRole]
    vm = roleFormEditVM(formKey, existingRole.uuid)
  })

  describe('Initial VM', () => {
    const expected = {
      name: 'Test Manager',
      permissions: [
        { resource: PermissionResource.DASHBOARD },
        { resource: PermissionResource.ORDERS },
        { resource: PermissionResource.CUSTOMERS }
      ]
    }

    describe.each([
      { field: 'name', expected: expected.name },
      { field: 'permissions', expected: expected.permissions }
    ])('Initial field value', ({ field, expected }) => {
      it(`should have ${field} field with correct value`, () => {
        const expectedField: Field<any> = {
          value: expected,
          canEdit: true
        }
        expect(vm.get(field)).toStrictEqual(expectedField)
      })

      it(`should save the ${field} value in form store`, () => {
        expect(formStore.get(formKey)[field]).toStrictEqual(expected)
      })
    })
  })

  describe('Role loading error handling', () => {
    it('should throw error for non-existent role', () => {
      expect(() => {
        roleFormEditVM('another-key', 'non-existent-uuid')
      }).toThrow('Role with UUID non-existent-uuid not found')
    })
  })

  describe('Available permissions', () => {
    it('should provide all permission resources', () => {
      const permissions = vm.getAvailablePermissions()
      const expectedCount = Object.values(PermissionResource).length

      expect(permissions).toHaveLength(expectedCount)
    })

    describe.each([
      { resource: PermissionResource.DASHBOARD, expectedSelected: true },
      { resource: PermissionResource.ORDERS, expectedSelected: true },
      { resource: PermissionResource.CUSTOMERS, expectedSelected: true },
      { resource: PermissionResource.STAFF, expectedSelected: false }
    ])('Permission selection state', ({ resource, expectedSelected }) => {
      it(`should mark ${resource} permission as ${
        expectedSelected ? 'selected' : 'unselected'
      }`, () => {
        const permissions = vm.getAvailablePermissions()
        const permission = permissions.find((p) => p.resource === resource)

        expect(permission?.selected).toBe(expectedSelected)
      })
    })
  })

  describe('Name field updates', () => {
    const updatedName = 'Updated Manager'
    const expectedField: Field<string> = {
      value: updatedName,
      canEdit: true
    }

    beforeEach(() => {
      vm.set('name', updatedName)
    })

    it('should update name field value', () => {
      expect(vm.get('name')).toStrictEqual(expectedField)
    })

    it('should save updated name in form store', () => {
      expect(formStore.get(formKey).name).toBe(updatedName)
    })
  })

  describe('Permission toggle operations', () => {
    describe('Toggle existing permission off', () => {
      const expectedPermissions = [
        { resource: PermissionResource.ORDERS },
        { resource: PermissionResource.CUSTOMERS }
      ]
      const expectedField: Field<any> = {
        value: expectedPermissions,
        canEdit: true
      }

      beforeEach(() => {
        vm.togglePermission(PermissionResource.DASHBOARD)
      })

      it('should remove permission from selected list', () => {
        expect(vm.get('permissions')).toStrictEqual(expectedField)
      })

      it('should save updated permissions in form store', () => {
        expect(formStore.get(formKey).permissions).toStrictEqual(
          expectedPermissions
        )
      })
    })

    describe('Toggle new permission on', () => {
      const expectedPermissions = [
        { resource: PermissionResource.DASHBOARD },
        { resource: PermissionResource.ORDERS },
        { resource: PermissionResource.CUSTOMERS },
        { resource: PermissionResource.STAFF }
      ]
      const expectedField: Field<any> = {
        value: expectedPermissions,
        canEdit: true
      }

      beforeEach(() => {
        vm.togglePermission(PermissionResource.STAFF)
      })

      it('should add permission to selected list', () => {
        expect(vm.get('permissions')).toStrictEqual(expectedField)
      })

      it('should save updated permissions in form store', () => {
        expect(formStore.get(formKey).permissions).toStrictEqual(
          expectedPermissions
        )
      })
    })
  })

  describe('Form validation', () => {
    describe.each([
      { description: 'initial data', setup: () => {}, expected: true },
      {
        description: 'empty name',
        setup: () => vm.set('name', ''),
        expected: false
      },
      {
        description: 'whitespace-only name',
        setup: () => vm.set('name', '   '),
        expected: false
      },
      {
        description: 'no permissions',
        setup: () => {
          vm.togglePermission(PermissionResource.DASHBOARD)
          vm.togglePermission(PermissionResource.ORDERS)
          vm.togglePermission(PermissionResource.CUSTOMERS)
        },
        expected: false
      },
      {
        description: 'valid name and permissions',
        setup: () => {
          vm.set('name', 'Valid Role')
          vm.togglePermission(PermissionResource.STAFF)
        },
        expected: true
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
        description: 'initial data',
        setup: () => {},
        expected: {
          name: 'Test Manager',
          permissions: [
            { resource: PermissionResource.DASHBOARD },
            { resource: PermissionResource.ORDERS },
            { resource: PermissionResource.CUSTOMERS }
          ]
        }
      },
      {
        description: 'modified name',
        setup: () => vm.set('name', 'Modified Manager'),
        expected: {
          name: 'Modified Manager',
          permissions: [
            { resource: PermissionResource.DASHBOARD },
            { resource: PermissionResource.ORDERS },
            { resource: PermissionResource.CUSTOMERS }
          ]
        }
      },
      {
        description: 'modified permissions',
        setup: () => {
          vm.togglePermission(PermissionResource.DASHBOARD)
          vm.togglePermission(PermissionResource.STAFF)
        },
        expected: {
          name: 'Test Manager',
          permissions: [
            { resource: PermissionResource.ORDERS },
            { resource: PermissionResource.CUSTOMERS },
            { resource: PermissionResource.STAFF }
          ]
        }
      },
      {
        description: 'single permission',
        setup: () => {
          vm.togglePermission(PermissionResource.ORDERS)
          vm.togglePermission(PermissionResource.CUSTOMERS)
        },
        expected: {
          name: 'Test Manager',
          permissions: [{ resource: PermissionResource.DASHBOARD }]
        }
      }
    ])('DTO scenarios', ({ description, setup, expected }) => {
      it(`should generate correct DTO with ${description}`, () => {
        setup()
        const expectedDto: EditRoleDTO = expected
        expect(vm.getDto()).toStrictEqual(expectedDto)
      })
    })
  })

  describe('Role UUID access', () => {
    it('should provide correct role UUID', () => {
      expect(vm.getRoleUuid()).toBe(existingRole.uuid)
    })
  })
})
