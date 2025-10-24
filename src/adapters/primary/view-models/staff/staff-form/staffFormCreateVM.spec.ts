import {
  StaffFormCreateVM,
  staffFormCreateVM
} from '@adapters/primary/view-models/staff/staff-form/staffFormCreateVM'
import { CreateStaffDTO } from '@core/gateways/staffGateway'
import { createPinia, setActivePinia } from 'pinia'

describe('StaffFormCreateVM', () => {
  let vm: StaffFormCreateVM
  const formKey = 'test-staff-form'

  beforeEach(() => {
    setActivePinia(createPinia())
    vm = staffFormCreateVM(formKey)
  })

  describe('Form initialization', () => {
    const expectedEmailField = {
      value: '',
      canEdit: true
    }

    it('should initialize with empty email field', () => {
      expect(vm.get('email')).toStrictEqual(expectedEmailField)
    })

    it('should initialize with empty firstname field', () => {
      const expectedFirstnameField = {
        value: '',
        canEdit: true
      }
      expect(vm.get('firstname')).toStrictEqual(expectedFirstnameField)
    })

    it('should initialize with empty lastname field', () => {
      const expectedLastnameField = {
        value: '',
        canEdit: true
      }
      expect(vm.get('lastname')).toStrictEqual(expectedLastnameField)
    })

    it('should initialize with empty roleUuid field', () => {
      const expectedRoleUuidField = {
        value: '',
        canEdit: true
      }
      expect(vm.get('roleUuid')).toStrictEqual(expectedRoleUuidField)
    })
  })

  describe('Email management', () => {
    describe.each([
      {
        description: 'valid email',
        value: 'john.doe@example.com',
        expected: 'john.doe@example.com'
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
    it('should set firstname value', () => {
      const expectedField = {
        value: 'John',
        canEdit: true
      }
      vm.set('firstname', 'John')
      expect(vm.get('firstname')).toStrictEqual(expectedField)
    })
  })

  describe('Lastname management', () => {
    it('should set lastname value', () => {
      const expectedField = {
        value: 'Doe',
        canEdit: true
      }
      vm.set('lastname', 'Doe')
      expect(vm.get('lastname')).toStrictEqual(expectedField)
    })
  })

  describe('RoleUuid management', () => {
    it('should set roleUuid value', () => {
      const expectedField = {
        value: 'role-admin',
        canEdit: true
      }
      vm.set('roleUuid', 'role-admin')
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
        setup: () => vm.set('email', 'test@example.com'),
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
      const expectedDto: CreateStaffDTO = {
        email: 'john.doe@example.com',
        firstname: 'John',
        lastname: 'Doe',
        roleUuid: 'role-admin'
      }

      it('should generate correct DTO with all fields', () => {
        vm.set('email', 'john.doe@example.com')
        vm.set('firstname', 'John')
        vm.set('lastname', 'Doe')
        vm.set('roleUuid', 'role-admin')
        expect(vm.getDto()).toStrictEqual(expectedDto)
      })
    })

    describe('With only required fields', () => {
      const expectedDto: CreateStaffDTO = {
        email: 'jane@example.com',
        roleUuid: 'role-pharmacist'
      }

      it('should generate correct DTO with only required fields', () => {
        vm.set('email', 'jane@example.com')
        vm.set('roleUuid', 'role-pharmacist')
        expect(vm.getDto()).toStrictEqual(expectedDto)
      })
    })

    describe('With email and firstname only', () => {
      const expectedDto: CreateStaffDTO = {
        email: 'alex@example.com',
        firstname: 'Alex',
        roleUuid: 'role-assistant'
      }

      it('should generate correct DTO with email and firstname', () => {
        vm.set('email', 'alex@example.com')
        vm.set('firstname', 'Alex')
        vm.set('roleUuid', 'role-assistant')
        expect(vm.getDto()).toStrictEqual(expectedDto)
      })
    })

    describe('With email and lastname only', () => {
      const expectedDto: CreateStaffDTO = {
        email: 'smith@example.com',
        lastname: 'Smith',
        roleUuid: 'role-pharmacist'
      }

      it('should generate correct DTO with email and lastname', () => {
        vm.set('email', 'smith@example.com')
        vm.set('lastname', 'Smith')
        vm.set('roleUuid', 'role-pharmacist')
        expect(vm.getDto()).toStrictEqual(expectedDto)
      })
    })
  })
})
