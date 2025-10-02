import { useRoleStore } from '@store/roleStore'
import { InMemoryRoleGateway } from '@adapters/secondary/role-gateways/InMemoryRoleGateway'
import { createPinia, setActivePinia } from 'pinia'
import { Role } from '@core/entities/role'
import { adminRole, pharmacistRole } from '@utils/testData/roles'
import {
  createRole,
  CreateRoleDTO
} from '@core/usecases/roles/role-creation/createRole'
import { PermissionResource } from '@core/entities/permissionResource'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { UUID } from '@core/types/types'

describe('Role Creation', () => {
  let roleStore: any
  let roleGateway: InMemoryRoleGateway
  const uuidGenerator = new FakeUuidGenerator()
  let uuid: UUID

  beforeEach(() => {
    setActivePinia(createPinia())
    roleStore = useRoleStore()
    roleGateway = new InMemoryRoleGateway(uuidGenerator)
  })

  describe('Creating a new role with valid data', () => {
    const dto: CreateRoleDTO = {
      name: 'Manager',
      permissions: [
        { resource: PermissionResource.DASHBOARD },
        { resource: PermissionResource.ORDERS },
        { resource: PermissionResource.CUSTOMERS }
      ]
    }

    beforeEach(() => {
      givenExistingRoles(adminRole, pharmacistRole)
      uuid = 'new-role-uuid'
      uuidGenerator.setNext(uuid)
    })

    beforeEach(async () => {
      await whenCreateRole(dto)
    })

    it('should create the role in the gateway', async () => {
      const roles = await roleGateway.list()
      expect(roles).toHaveLength(3)
      const createdRole = roles.find((r) => r.name === 'Manager')
      expect(createdRole).toEqual({
        uuid: 'new-role-uuid',
        name: 'Manager',
        permissions: dto.permissions,
        order: 2
      })
    })

    it('should add the role to the store', () => {
      expect(roleStore.items).toHaveLength(3)
      const createdRole = roleStore.items.find(
        (r: Role) => r.name === 'Manager'
      )
      expect(createdRole).toEqual({
        uuid: 'new-role-uuid',
        name: 'Manager',
        permissions: dto.permissions,
        order: 2
      })
    })
  })

  describe('Creating a role with minimal permissions', () => {
    const dto: CreateRoleDTO = {
      name: 'Basic User',
      permissions: [{ resource: PermissionResource.DASHBOARD }]
    }

    beforeEach(() => {
      givenExistingRoles(adminRole)
      uuid = 'basic-user-uuid'
      uuidGenerator.setNext(uuid)
    })

    beforeEach(async () => {
      await whenCreateRole(dto)
    })

    it('should handle single permission role creation', async () => {
      const roles = await roleGateway.list()
      const createdRole = roles.find((r) => r.name === 'Basic User')
      expect(createdRole).toEqual({
        uuid: 'basic-user-uuid',
        name: 'Basic User',
        permissions: [{ resource: PermissionResource.DASHBOARD }],
        order: 1
      })
    })
  })

  describe('Creating a role with no permissions', () => {
    const dto: CreateRoleDTO = {
      name: 'No Permissions Role',
      permissions: []
    }

    beforeEach(() => {
      givenExistingRoles()
      uuid = 'no-permissions-uuid'
      uuidGenerator.setNext(uuid)
    })

    beforeEach(async () => {
      await whenCreateRole(dto)
    })

    it('should handle empty permissions array', async () => {
      const roles = await roleGateway.list()
      const createdRole = roles.find((r) => r.name === 'No Permissions Role')
      expect(createdRole).toEqual({
        uuid: 'no-permissions-uuid',
        name: 'No Permissions Role',
        permissions: [],
        order: 0
      })
    })
  })

  describe('Loading states', () => {
    const dto: CreateRoleDTO = {
      name: 'Test Role',
      permissions: [{ resource: PermissionResource.DASHBOARD }]
    }

    it('should set loading to true during creation', async () => {
      const unsubscribe = roleStore.$subscribe((mutation: any, state: any) => {
        expect(state.isLoading).toBe(true)
        unsubscribe()
      })

      await whenCreateRole(dto)
    })

    it('should set loading to false after creation completes', async () => {
      await whenCreateRole(dto)
      expect(roleStore.isLoading).toBe(false)
    })
  })

  const givenExistingRoles = (...roles: Array<Role>) => {
    roleGateway.feedWith(...JSON.parse(JSON.stringify(roles)))
    roleStore.items = JSON.parse(JSON.stringify(roles))
  }

  const whenCreateRole = async (dto: CreateRoleDTO): Promise<void> => {
    await createRole(dto, roleGateway)
  }
})
