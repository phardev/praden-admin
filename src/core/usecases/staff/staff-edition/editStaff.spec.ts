import { InMemoryStaffGateway } from '@adapters/secondary/staff-gateways/InMemoryStaffGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Staff } from '@core/entities/staff'
import { UUID } from '@core/types/types'
import {
  EditStaffDTO,
  editStaff
} from '@core/usecases/staff/staff-edition/editStaff'
import { useStaffStore } from '@store/staffStore'
import { adminRole, assistantRole, pharmacistRole } from '@utils/testData/roles'
import { createPinia, setActivePinia } from 'pinia'

describe('Staff Edition', () => {
  let staffStore: any
  let staffGateway: InMemoryStaffGateway
  const uuidGenerator = new FakeUuidGenerator()
  const staffUuid: UUID = 'staff-uuid-1'

  const existingStaff: Staff = {
    uuid: staffUuid,
    email: 'old@example.com',
    firstname: 'Old',
    lastname: 'Name',
    role: pharmacistRole
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    staffStore = useStaffStore()
    staffGateway = new InMemoryStaffGateway(uuidGenerator)
    staffGateway.feedWithRoles(adminRole, pharmacistRole, assistantRole)
    staffGateway.feedWithStaff(existingStaff)
    staffStore.list([existingStaff])
  })

  describe('With all fields', () => {
    const dto: EditStaffDTO = {
      email: 'john.doe@example.com',
      firstname: 'John',
      lastname: 'Doe',
      roleUuid: 'role-admin'
    }
    const expectedStaff: Staff = {
      uuid: staffUuid,
      email: 'john.doe@example.com',
      firstname: 'John',
      lastname: 'Doe',
      role: adminRole
    }

    beforeEach(async () => {
      await whenEditStaff(staffUuid, dto)
    })

    it('should update the staff in the store', () => {
      expect(staffStore.items).toStrictEqual([expectedStaff])
    })

    it('should update the staff in the gateway', async () => {
      expect(await staffGateway.list()).toStrictEqual([expectedStaff])
    })
  })

  describe('With only required fields', () => {
    const dto: EditStaffDTO = {
      email: 'jane@example.com',
      roleUuid: 'role-assistant'
    }
    const expectedStaff: Staff = {
      uuid: staffUuid,
      email: 'jane@example.com',
      role: assistantRole
    }

    beforeEach(async () => {
      await whenEditStaff(staffUuid, dto)
    })

    it('should update the staff in the store', () => {
      expect(staffStore.items).toStrictEqual([expectedStaff])
    })

    it('should update the staff in the gateway', async () => {
      expect(await staffGateway.list()).toStrictEqual([expectedStaff])
    })
  })

  describe('With optional fields', () => {
    describe('Email and firstname only', () => {
      const dto: EditStaffDTO = {
        email: 'alex@example.com',
        firstname: 'Alex',
        roleUuid: 'role-admin'
      }
      const expectedStaff: Staff = {
        uuid: staffUuid,
        email: 'alex@example.com',
        firstname: 'Alex',
        role: adminRole
      }

      beforeEach(async () => {
        await whenEditStaff(staffUuid, dto)
      })

      it('should update the staff in the store', () => {
        expect(staffStore.items).toStrictEqual([expectedStaff])
      })
    })

    describe('Email and lastname only', () => {
      const dto: EditStaffDTO = {
        email: 'smith@example.com',
        lastname: 'Smith',
        roleUuid: 'role-pharmacist'
      }
      const expectedStaff: Staff = {
        uuid: staffUuid,
        email: 'smith@example.com',
        lastname: 'Smith',
        role: pharmacistRole
      }

      beforeEach(async () => {
        await whenEditStaff(staffUuid, dto)
      })

      it('should update the staff in the store', () => {
        expect(staffStore.items).toStrictEqual([expectedStaff])
      })
    })
  })

  describe('Loading states', () => {
    const dto: EditStaffDTO = {
      email: 'test@example.com',
      roleUuid: 'role-admin'
    }

    it('should set loading to true during edition', async () => {
      const unsubscribe = staffStore.$subscribe((mutation: any, state: any) => {
        expect(state.isLoading).toBe(true)
        unsubscribe()
      })

      await whenEditStaff(staffUuid, dto)
    })

    it('should set loading to false after edition completes', async () => {
      await whenEditStaff(staffUuid, dto)
      expect(staffStore.isLoading).toBe(false)
    })
  })

  const whenEditStaff = async (
    uuid: UUID,
    dto: EditStaffDTO
  ): Promise<void> => {
    await editStaff(uuid, dto, staffGateway)
  }
})
