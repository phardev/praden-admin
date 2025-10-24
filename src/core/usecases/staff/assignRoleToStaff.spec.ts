import { InMemoryStaffGateway } from '@adapters/secondary/staff-gateways/InMemoryStaffGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Staff } from '@core/entities/staff'
import { assignRoleToStaff } from '@core/usecases/staff/assignRoleToStaff'
import { useStaffStore } from '@store/staffStore'
import { adminRole, assistantRole, pharmacistRole } from '@utils/testData/roles'
import { janeDupont, johnDoe } from '@utils/testData/staff'
import { createPinia, setActivePinia } from 'pinia'

describe('Assign role to staff', () => {
  let staffStore: any
  let staffGateway: InMemoryStaffGateway
  let uuidGenerator: FakeUuidGenerator

  beforeEach(() => {
    setActivePinia(createPinia())
    staffStore = useStaffStore()
    uuidGenerator = new FakeUuidGenerator()
    staffGateway = new InMemoryStaffGateway(uuidGenerator)
    staffStore.list([johnDoe, janeDupont])
  })

  describe('Given the staff member exists and role exists', () => {
    beforeEach(() => {
      givenExistingStaff(johnDoe, janeDupont)
      givenExistingRoles(adminRole, pharmacistRole, assistantRole)
    })

    it('should assign the role to staff member', async () => {
      await whenAssignRoleToStaff(johnDoe.uuid, assistantRole.uuid)

      const expectedStaff: Staff = {
        ...johnDoe,
        role: assistantRole
      }
      expect(await staffGateway.list()).toContainEqual(expectedStaff)
    })

    it('should update the staff member in the store', async () => {
      await whenAssignRoleToStaff(janeDupont.uuid, adminRole.uuid)

      const expectedStaff: Staff = {
        ...janeDupont,
        role: adminRole
      }
      expect(staffStore.getByUuid(janeDupont.uuid)).toStrictEqual(expectedStaff)
    })

    it('should update current staff when it matches the updated staff', async () => {
      staffStore.setCurrent(johnDoe)

      await whenAssignRoleToStaff(johnDoe.uuid, pharmacistRole.uuid)

      const expectedStaff: Staff = {
        ...johnDoe,
        role: pharmacistRole
      }
      expect(staffStore.current).toStrictEqual(expectedStaff)
    })
  })

  describe('Given the staff member does not exist', () => {
    beforeEach(() => {
      givenExistingRoles(adminRole, pharmacistRole, assistantRole)
    })

    it('should throw an error', async () => {
      await expect(
        whenAssignRoleToStaff('non-existent-uuid', adminRole.uuid)
      ).rejects.toThrow('Staff with UUID non-existent-uuid not found')
    })
  })

  describe('Given the role does not exist', () => {
    beforeEach(() => {
      givenExistingStaff(johnDoe, janeDupont)
    })

    it('should throw an error', async () => {
      await expect(
        whenAssignRoleToStaff(johnDoe.uuid, 'non-existent-role-uuid')
      ).rejects.toThrow('Role with UUID non-existent-role-uuid not found')
    })
  })

  const givenExistingStaff = (...staff: Array<Staff>) => {
    staffGateway.feedWith(...staff)
    staffStore.list(staff)
  }

  const givenExistingRoles = (...roles: any[]) => {
    staffGateway.feedWithRoles(...roles)
  }

  const whenAssignRoleToStaff = async (staffUuid: string, roleUuid: string) => {
    await assignRoleToStaff(staffUuid, roleUuid, staffGateway)
  }
})
