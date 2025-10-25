import {
  StaffFormEditVM,
  staffFormEditVM
} from '@adapters/primary/view-models/staff/staff-form/staffFormEditVM'
import { Staff } from '@core/entities/staff'
import { EditStaffDTO } from '@core/gateways/staffGateway'
import { UUID } from '@core/types/types'
import { useStaffStore } from '@store/staffStore'
import { adminRole } from '@utils/testData/roles'
import { createPinia, setActivePinia } from 'pinia'

describe('StaffFormEditVM', () => {
  let vm: StaffFormEditVM
  let staffStore: any
  const formKey = 'test-staff-edit-form'
  const staffUuid: UUID = 'staff-uuid-1'

  const existingStaff: Staff = {
    uuid: staffUuid,
    email: 'john.doe@example.com',
    firstname: 'John',
    lastname: 'Doe',
    role: adminRole
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    staffStore = useStaffStore()
    staffStore.list([existingStaff])
    vm = staffFormEditVM(formKey, staffUuid)
  })

  describe('Form initialization', () => {
    it('should initialize with existing email', () => {
      const expectedEmailField = {
        value: 'john.doe@example.com',
        canEdit: true
      }
      expect(vm.get('email')).toStrictEqual(expectedEmailField)
    })

    it('should initialize with existing firstname', () => {
      const expectedFirstnameField = {
        value: 'John',
        canEdit: true
      }
      expect(vm.get('firstname')).toStrictEqual(expectedFirstnameField)
    })

    it('should initialize with existing lastname', () => {
      const expectedLastnameField = {
        value: 'Doe',
        canEdit: true
      }
      expect(vm.get('lastname')).toStrictEqual(expectedLastnameField)
    })

    it('should initialize with existing roleUuid', () => {
      const expectedRoleUuidField = {
        value: 'role-admin',
        canEdit: true
      }
      expect(vm.get('roleUuid')).toStrictEqual(expectedRoleUuidField)
    })
  })

  describe('Email management', () => {
    describe.each([
      {
        description: 'valid email',
        value: 'new.email@example.com',
        expected: 'new.email@example.com'
      },
      { description: 'empty email', value: '', expected: '' }
    ])('Email field updates', ({ description, value, expected }) => {
      const expectedField = {
        value: expected,
        canEdit: true
      }

      it(`should handle ${description}`, () => {
        vm.set('email', value)
        expect(vm.get('email')).toStrictEqual(expectedField)
      })
    })
  })

  describe('Firstname management', () => {
    it('should update firstname value', () => {
      const expectedField = {
        value: 'Jane',
        canEdit: true
      }
      vm.set('firstname', 'Jane')
      expect(vm.get('firstname')).toStrictEqual(expectedField)
    })
  })

  describe('Lastname management', () => {
    it('should update lastname value', () => {
      const expectedField = {
        value: 'Smith',
        canEdit: true
      }
      vm.set('lastname', 'Smith')
      expect(vm.get('lastname')).toStrictEqual(expectedField)
    })
  })

  describe('RoleUuid management', () => {
    it('should update roleUuid value', () => {
      const expectedField = {
        value: 'role-pharmacist',
        canEdit: true
      }
      vm.set('roleUuid', 'role-pharmacist')
      expect(vm.get('roleUuid')).toStrictEqual(expectedField)
    })
  })

  describe('Form validation', () => {
    describe.each([
      {
        description: 'empty email with roleUuid',
        setup: () => {
          vm.set('email', '')
          vm.set('roleUuid', 'role-admin')
        },
        expected: false
      },
      {
        description: 'valid email without roleUuid',
        setup: () => {
          vm.set('email', 'test@example.com')
          vm.set('roleUuid', '')
        },
        expected: false
      },
      {
        description: 'valid email with roleUuid',
        setup: () => {
          vm.set('email', 'test@example.com')
          vm.set('roleUuid', 'role-admin')
        },
        expected: true
      },
      {
        description: 'whitespace-only email with roleUuid',
        setup: () => {
          vm.set('email', '   ')
          vm.set('roleUuid', 'role-admin')
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
    describe('With all fields', () => {
      const expectedDto: EditStaffDTO = {
        email: 'new.email@example.com',
        firstname: 'Jane',
        lastname: 'Smith',
        roleUuid: 'role-pharmacist'
      }

      it('should generate correct DTO with all fields', () => {
        vm.set('email', 'new.email@example.com')
        vm.set('firstname', 'Jane')
        vm.set('lastname', 'Smith')
        vm.set('roleUuid', 'role-pharmacist')
        expect(vm.getDto()).toStrictEqual(expectedDto)
      })
    })

    describe('With only required fields', () => {
      const expectedDto: EditStaffDTO = {
        email: 'minimal@example.com',
        roleUuid: 'role-assistant'
      }

      it('should generate correct DTO with only required fields', () => {
        vm.set('email', 'minimal@example.com')
        vm.set('firstname', '')
        vm.set('lastname', '')
        vm.set('roleUuid', 'role-assistant')
        expect(vm.getDto()).toStrictEqual(expectedDto)
      })
    })

    describe('With email and firstname only', () => {
      const expectedDto: EditStaffDTO = {
        email: 'alex@example.com',
        firstname: 'Alex',
        roleUuid: 'role-pharmacist'
      }

      it('should generate correct DTO with email and firstname', () => {
        vm.set('email', 'alex@example.com')
        vm.set('firstname', 'Alex')
        vm.set('lastname', '')
        vm.set('roleUuid', 'role-pharmacist')
        expect(vm.getDto()).toStrictEqual(expectedDto)
      })
    })

    describe('With email and lastname only', () => {
      const expectedDto: EditStaffDTO = {
        email: 'brown@example.com',
        lastname: 'Brown',
        roleUuid: 'role-admin'
      }

      it('should generate correct DTO with email and lastname', () => {
        vm.set('email', 'brown@example.com')
        vm.set('firstname', '')
        vm.set('lastname', 'Brown')
        vm.set('roleUuid', 'role-admin')
        expect(vm.getDto()).toStrictEqual(expectedDto)
      })
    })
  })
})
