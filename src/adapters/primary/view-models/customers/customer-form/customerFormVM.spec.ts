import {
  CustomerFormCreateVM,
  customerFormCreateVM
} from '@adapters/primary/view-models/customers/customer-form/customerFormCreateVM'
import {
  CustomerFormEditVM,
  customerFormEditVM
} from '@adapters/primary/view-models/customers/customer-form/customerFormEditVM'
import {
  CustomerFormGetVM,
  customerFormGetVM
} from '@adapters/primary/view-models/customers/customer-form/customerFormGetVM'
import { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { CreateCustomerDTO } from '@core/usecases/customers/customer-creation/createCustomer'
import { useCustomerStore } from '@store/customerStore'
import { useFormStore } from '@store/formStore'
import { elodieDurand, lucasLefevre } from '@utils/testData/customers'
import { createPinia, setActivePinia } from 'pinia'

const editableInitialVMTests = (
  getVM: () => CustomerFormCreateVM | CustomerFormEditVM | CustomerFormGetVM,
  key: string,
  expectedValue: any
) => {
  return initialVMTests(getVM, key, expectedValue, true)
}

const readOnlyInitialVMTests = (
  getVM: () => CustomerFormCreateVM | CustomerFormEditVM | CustomerFormGetVM,
  key: string,
  expectedValue: any
) => {
  return initialVMTests(getVM, key, expectedValue, false)
}

const initialVMTests = (
  getVM: () => CustomerFormCreateVM | CustomerFormEditVM | CustomerFormGetVM,
  key: string,
  expectedValue: any,
  editable: boolean
) => {
  let formStore: any
  let vm: any

  beforeEach(() => {
    formStore = useFormStore()
    vm = getVM()
  })
  describe.each([
    { field: 'firstname', expected: expectedValue.firstname },
    { field: 'lastname', expected: expectedValue.lastname },
    { field: 'email', expected: expectedValue.email },
    { field: 'phone', expected: expectedValue.phone }
  ])('Initial field value', ({ field, expected }) => {
    it(`should have ${field} to be "${expected}"`, () => {
      const expectedField: Field<any> = {
        value: expected,
        canEdit: editable
      }
      expect(vm.get(field)).toStrictEqual(expectedField)
    })
    it(`should save the ${field} value in form store`, () => {
      expect(formStore.get(key)[field]).toStrictEqual(expected)
    })
  })
}

export const updateFieldsTests = (
  getVM: () => CustomerFormCreateVM | CustomerFormEditVM,
  key: string
) => {
  let formStore: any
  let vm: CustomerFormCreateVM | CustomerFormEditVM
  beforeEach(() => {
    formStore = useFormStore()
    vm = getVM()
  })
  describe.each([
    { field: 'firstname', value: 'New firstname', expected: 'New firstname' },
    {
      field: 'lastname',
      value: 'the new lastname',
      expected: 'the new lastname'
    },
    {
      field: 'email',
      value: 'new@email.com',
      expected: 'new@email.com'
    },
    {
      field: 'phone',
      value: '+33698754321',
      expected: '+33698754321'
    }
  ])('Update simple fields', ({ field, value, expected }) => {
    it(`should update ${field} value in form store`, () => {
      vm.set(field, value)
      expect(formStore.get(key)[field]).toStrictEqual(expected)
    })
    it(`should update ${field} field`, () => {
      vm.set(field, value)
      const expectedField: Field<any> = {
        value: expected,
        canEdit: true
      }
      expect(vm.get(field)).toStrictEqual(expectedField)
    })
  })
}

describe('Customer form', () => {
  let customerStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    customerStore = useCustomerStore()
  })

  describe('Customer form get VM', () => {
    let vm: CustomerFormGetVM
    const key = 'get-customer-form'
    const customer = lucasLefevre
    beforeEach(() => {
      customerStore.current = customer
      vm = customerFormGetVM(key)
    })
    describe('Initial VM', () => {
      const expected: any = {
        firstname: customer.firstname,
        lastname: customer.lastname,
        email: customer.email,
        phone: customer.phone
      }
      readOnlyInitialVMTests(() => vm, key, expected)
    })
    describe('Validation', () => {
      describe('Display validate', () => {
        it('should never display the validate button', () => {
          expect(vm.getDisplayValidate()).toBe(false)
        })
      })
      describe('Can validate', () => {
        it('should not allow to validate', () => {
          expect(vm.getCanValidate()).toBe(false)
        })
      })
    })
  })
  describe('Customer form create VM', () => {
    let vm: CustomerFormCreateVM
    const key = 'create-customer-form'

    beforeEach(() => {
      vm = customerFormCreateVM(key)
    })

    describe('Initial VM', () => {
      const expected: any = {
        firstname: '',
        lastname: '',
        email: '',
        phone: ''
      }
      editableInitialVMTests(() => vm, key, expected)
    })
    describe('Update', () => {
      updateFieldsTests(() => vm, key)
    })
    describe('DTO', () => {
      describe('For a dto', () => {
        it('should prepare the dto', () => {
          const expectedDTO: CreateCustomerDTO = {
            firstname: 'jean',
            lastname: 'bon',
            email: 'jeanbon@email.com',
            phone: '0987654321',
            ordersCount: 0,
            ordersTotal: 0,
            loyaltyPointsBalance: 0
          }
          vm.set('firstname', expectedDTO.firstname)
          vm.set('lastname', expectedDTO.lastname)
          vm.set('email', expectedDTO.email)
          vm.set('phone', expectedDTO.phone)
          expect(vm.getDto()).toStrictEqual(expectedDTO)
        })
      })
    })
    describe('Validation', () => {
      describe('Display validate', () => {
        it('should always display the validate button', () => {
          expect(vm.getDisplayValidate()).toBe(true)
        })
      })
      describe('Can validate', () => {
        it('should allow to validate', () => {
          expect(vm.getCanValidate()).toBe(true)
        })
      })
    })
  })
  describe('Customer form edit VM', () => {
    let vm: CustomerFormEditVM
    const key = 'edit-category-form'

    const customer = elodieDurand
    beforeEach(() => {
      customerStore.current = customer
      vm = customerFormEditVM(key)
    })
    describe('Initial VM', () => {
      const expected: any = {
        firstname: customer.firstname,
        lastname: customer.lastname,
        email: customer.email,
        phone: customer.phone
      }
      editableInitialVMTests(() => vm, key, expected)
    })
    describe('Update', () => {
      updateFieldsTests(() => vm, key)
    })
    describe('DTO', () => {
      describe('For a dto', () => {
        it('should prepare the dto', () => {
          const expectedDTO: CreateCustomerDTO = {
            firstname: 'jean',
            lastname: 'bon',
            email: 'jeanbon@email.com',
            phone: '0987654321',
            ordersCount: 0,
            ordersTotal: 0,
            loyaltyPointsBalance: 0
          }
          vm.set('firstname', expectedDTO.firstname)
          vm.set('lastname', expectedDTO.lastname)
          vm.set('email', expectedDTO.email)
          vm.set('phone', expectedDTO.phone)
          expect(vm.getDto()).toStrictEqual(expectedDTO)
        })
      })
    })
    describe('Validation', () => {
      describe('Display validate', () => {
        it('should always display the validate button', () => {
          expect(vm.getDisplayValidate()).toBe(true)
        })
      })
      describe('Can validate', () => {
        it('should allow to validate', () => {
          expect(vm.getCanValidate()).toBe(true)
        })
      })
    })
  })
})
