import { Role } from '@core/entities/role'
import { InMemoryRoleGateway } from '@adapters/secondary/role-gateways/InMemoryRoleGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { createPinia, setActivePinia } from 'pinia'
import { useRoleStore } from '@store/roleStore'
import { adminRole, pharmacistRole, assistantRole } from '@utils/testData/roles'
import { reorderRoles } from '@core/usecases/roles/roles-reorder/reorderRoles'
import { UUID } from '@core/types/types'

describe('Roles reorder', () => {
  let roleGateway: InMemoryRoleGateway
  let roleStore: any
  let expectedRoles: Array<Role>

  beforeEach(() => {
    setActivePinia(createPinia())
    roleGateway = new InMemoryRoleGateway(new FakeUuidGenerator())
    roleStore = useRoleStore()
    givenExistingRoles(adminRole, pharmacistRole, assistantRole)
  })

  describe('For a reorder', () => {
    beforeEach(async () => {
      expectedRoles = [
        {
          ...pharmacistRole,
          order: 0
        },
        {
          ...adminRole,
          order: 1
        },
        {
          ...assistantRole,
          order: 2
        }
      ]
      await whenReorderRoles([
        pharmacistRole.uuid,
        adminRole.uuid,
        assistantRole.uuid
      ])
    })
    it('should reorder roles in gateway', async () => {
      expect(await roleGateway.list()).toStrictEqual(expectedRoles)
    })
    it('should reorder roles in store', () => {
      expect(roleStore.items).toStrictEqual(expectedRoles)
    })
  })

  describe('For another reorder', () => {
    beforeEach(async () => {
      expectedRoles = [
        {
          ...assistantRole,
          order: 0
        },
        {
          ...pharmacistRole,
          order: 1
        },
        {
          ...adminRole,
          order: 2
        }
      ]
      await whenReorderRoles([
        assistantRole.uuid,
        pharmacistRole.uuid,
        adminRole.uuid
      ])
    })
    it('should reorder roles in gateway', async () => {
      expect(await roleGateway.list()).toStrictEqual(expectedRoles)
    })
    it('should reorder roles in store', () => {
      expect(roleStore.items).toStrictEqual(expectedRoles)
    })
  })

  const givenExistingRoles = (...roles: Array<Role>) => {
    roleGateway.feedWith(...roles)
    roleStore.items = roles
  }

  const whenReorderRoles = async (roles: Array<UUID>) => {
    await reorderRoles(roles, roleGateway)
  }
})
