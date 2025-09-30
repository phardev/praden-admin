import { useStaffStore } from '@store/staffStore'
import { InMemoryStaffGateway } from '@adapters/secondary/staff-gateways/InMemoryStaffGateway'
import { createPinia, setActivePinia } from 'pinia'
import { Staff } from '@core/entities/staff'
import { adminRole, pharmacistRole, assistantRole } from '@utils/testData/roles'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { UUID } from '@core/types/types'
import {
  createStaff,
  CreateStaffDTO
} from '@core/usecases/staff/staff-creation/createStaff'

describe('Staff Creation', () => {
  let staffStore: any
  let staffGateway: InMemoryStaffGateway
  const uuidGenerator = new FakeUuidGenerator()
  let uuid: UUID

  beforeEach(() => {
    setActivePinia(createPinia())
    staffStore = useStaffStore()
    staffGateway = new InMemoryStaffGateway(uuidGenerator)
    staffGateway.feedWithRoles(adminRole, pharmacistRole, assistantRole)
  })

  describe('With all fields', () => {
    const dto: CreateStaffDTO = {
      email: 'john.doe@example.com',
      firstname: 'John',
      lastname: 'Doe',
      roleUuid: 'role-admin'
    }
    const expectedStaff: Staff = {
      uuid: 'new-staff-uuid',
      email: 'john.doe@example.com',
      firstname: 'John',
      lastname: 'Doe',
      role: adminRole
    }

    beforeEach(() => {
      uuid = 'new-staff-uuid'
      uuidGenerator.setNext(uuid)
    })

    beforeEach(async () => {
      await whenCreateStaff(dto)
    })

    it('should save the staff in the store', () => {
      expect(staffStore.items).toStrictEqual([expectedStaff])
    })

    it('should save the staff in the gateway', async () => {
      expect(await staffGateway.list()).toStrictEqual([expectedStaff])
    })
  })

  describe('With only required fields', () => {
    const dto: CreateStaffDTO = {
      email: 'jane@example.com',
      roleUuid: 'role-pharmacist'
    }
    const expectedStaff: Staff = {
      uuid: 'new-staff-uuid-2',
      email: 'jane@example.com',
      role: pharmacistRole
    }

    beforeEach(() => {
      uuid = 'new-staff-uuid-2'
      uuidGenerator.setNext(uuid)
    })

    beforeEach(async () => {
      await whenCreateStaff(dto)
    })

    it('should save the staff in the store', () => {
      expect(staffStore.items).toStrictEqual([expectedStaff])
    })

    it('should save the staff in the gateway', async () => {
      expect(await staffGateway.list()).toStrictEqual([expectedStaff])
    })
  })

  describe('With optional fields', () => {
    describe('Email and firstname only', () => {
      const dto: CreateStaffDTO = {
        email: 'alex@example.com',
        firstname: 'Alex',
        roleUuid: 'role-assistant'
      }
      const expectedStaff: Staff = {
        uuid: 'new-staff-uuid-3',
        email: 'alex@example.com',
        firstname: 'Alex',
        role: assistantRole
      }

      beforeEach(() => {
        uuid = 'new-staff-uuid-3'
        uuidGenerator.setNext(uuid)
      })

      beforeEach(async () => {
        await whenCreateStaff(dto)
      })

      it('should save the staff in the store', () => {
        expect(staffStore.items).toStrictEqual([expectedStaff])
      })
    })

    describe('Email and lastname only', () => {
      const dto: CreateStaffDTO = {
        email: 'smith@example.com',
        lastname: 'Smith',
        roleUuid: 'role-pharmacist'
      }
      const expectedStaff: Staff = {
        uuid: 'new-staff-uuid-4',
        email: 'smith@example.com',
        lastname: 'Smith',
        role: pharmacistRole
      }

      beforeEach(() => {
        uuid = 'new-staff-uuid-4'
        uuidGenerator.setNext(uuid)
      })

      beforeEach(async () => {
        await whenCreateStaff(dto)
      })

      it('should save the staff in the store', () => {
        expect(staffStore.items).toStrictEqual([expectedStaff])
      })
    })
  })

  describe('Loading states', () => {
    const dto: CreateStaffDTO = {
      email: 'test@example.com',
      roleUuid: 'role-admin'
    }

    it('should set loading to true during creation', async () => {
      const unsubscribe = staffStore.$subscribe((mutation: any, state: any) => {
        expect(state.isLoading).toBe(true)
        unsubscribe()
      })

      await whenCreateStaff(dto)
    })

    it('should set loading to false after creation completes', async () => {
      await whenCreateStaff(dto)
      expect(staffStore.isLoading).toBe(false)
    })
  })

  const whenCreateStaff = async (dto: CreateStaffDTO): Promise<void> => {
    await createStaff(dto, staffGateway)
  }
})
