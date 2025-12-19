import { InMemoryRoleGateway } from '@adapters/secondary/role-gateways/InMemoryRoleGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Role } from '@core/entities/role'
import type { EditRoleDTO } from '@core/gateways/roleGateway'
import { UUID } from '@core/types/types'
import { editRole } from '@core/usecases/roles/role-edition/editRole'
import { useRoleStore } from '@store/roleStore'
import { adminRole, assistantRole, pharmacistRole } from '@utils/testData/roles'
import { createPinia, setActivePinia } from 'pinia'

describe('Role Edition', () => {
  let roleStore: any
  let roleGateway: InMemoryRoleGateway
  const uuidGenerator = new FakeUuidGenerator()

  beforeEach(() => {
    setActivePinia(createPinia())
    roleStore = useRoleStore()
    roleGateway = new InMemoryRoleGateway(uuidGenerator)
  })

  describe('The role exists', () => {
    beforeEach(() => {
      givenExistingRoles(adminRole, pharmacistRole, assistantRole)
    })

    describe('For admin role', () => {
      const dto: EditRoleDTO = {
        name: 'Super Administrateur',
        permissions: [
          { resource: 'dashboard' },
          { resource: 'newsletter' },
          { resource: 'administration' },
          { resource: 'user-management' },
          { resource: 'new-permission' }
        ]
      }
      const expectedRole: Role = {
        ...adminRole,
        name: 'Super Administrateur',
        permissions: dto.permissions!
      }
      const expectedRoles: Array<Role> = [
        expectedRole,
        pharmacistRole,
        assistantRole
      ]

      beforeEach(async () => {
        await whenEditRole(adminRole.uuid, dto)
      })

      it('should edit the role in the gateway', async () => {
        expect(await roleGateway.list()).toEqual(expectedRoles)
      })

      it('should edit the role in the store', () => {
        expect(roleStore.items).toEqual(expectedRoles)
      })
    })

    describe('For pharmacist role', () => {
      const dto: EditRoleDTO = {
        name: 'Pharmacien Titulaire',
        permissions: [
          { resource: 'dashboard' },
          { resource: 'newsletter' },
          { resource: 'reports' }
        ]
      }
      const expectedRole: Role = {
        ...pharmacistRole,
        name: 'Pharmacien Titulaire',
        permissions: dto.permissions!
      }
      const expectedRoles: Array<Role> = [
        adminRole,
        expectedRole,
        assistantRole
      ]

      beforeEach(async () => {
        await whenEditRole(pharmacistRole.uuid, dto)
      })

      it('should edit the role in the gateway', async () => {
        expect(await roleGateway.list()).toEqual(expectedRoles)
      })

      it('should edit the role in the store', () => {
        expect(roleStore.items).toEqual(expectedRoles)
      })
    })

    describe('Empty permissions', () => {
      const dto: EditRoleDTO = {
        name: 'Limited Assistant',
        permissions: []
      }
      const expectedRole: Role = {
        ...assistantRole,
        name: 'Limited Assistant',
        permissions: []
      }

      beforeEach(async () => {
        await whenEditRole(assistantRole.uuid, dto)
      })

      it('should handle empty permissions array', async () => {
        const roles = await roleGateway.list()
        const editedRole = roles.find((r) => r.uuid === assistantRole.uuid)
        expect(editedRole).toEqual(expectedRole)
      })
    })
  })

  describe('The role does not exist', () => {
    it('should throw an error', async () => {
      await expect(
        whenEditRole('non-existent-uuid', {
          name: 'New Name',
          permissions: [{ resource: 'dashboard' }]
        })
      ).rejects.toThrow('Role with UUID non-existent-uuid not found')
    })
  })

  describe('Loading states', () => {
    beforeEach(() => {
      givenExistingRoles(adminRole)
    })

    it('should set loading to true during edit', async () => {
      const dto: EditRoleDTO = {
        name: 'Updated Admin',
        permissions: [{ resource: 'dashboard' }]
      }

      const unsubscribe = roleStore.$subscribe((mutation: any, state: any) => {
        expect(state.isLoading).toBe(true)
        unsubscribe()
      })

      await whenEditRole(adminRole.uuid, dto)
    })

    it('should set loading to false after edit completes', async () => {
      const dto: EditRoleDTO = {
        name: 'Updated Admin',
        permissions: [{ resource: 'dashboard' }]
      }

      await whenEditRole(adminRole.uuid, dto)
      expect(roleStore.isLoading).toBe(false)
    })

    it('should set loading to false after edit fails', async () => {
      const dto: EditRoleDTO = {
        name: 'Updated Role',
        permissions: [{ resource: 'dashboard' }]
      }

      try {
        await whenEditRole('non-existent-uuid', dto)
      } catch {
        // Expected to fail
      }

      expect(roleStore.isLoading).toBe(false)
    })
  })

  const givenExistingRoles = (...roles: Array<Role>) => {
    roleGateway.feedWith(...JSON.parse(JSON.stringify(roles)))
    roleStore.items = JSON.parse(JSON.stringify(roles))
  }

  const whenEditRole = async (
    roleUuid: UUID,
    dto: EditRoleDTO
  ): Promise<void> => {
    await editRole(roleUuid, dto, roleGateway)
  }
})
