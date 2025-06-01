import { useFormStore } from '@store/formStore'
import { useCustomerStore } from '@store/customerStore'
import { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { createPinia, setActivePinia } from 'pinia'
import {
  CustomerFormGetVM,
  customerFormGetVM
} from '@adapters/primary/view-models/customers/customer-form/customerFormGetVM'
import {
  elodieDurand,
  lucasLefevre,
  sophieMartinez
} from '@utils/testData/customers'

describe('Customer form get VM', () => {
  let customerStore: any
  let formStore: any
  let vm: CustomerFormGetVM
  const key = 'get-customer-form'

  beforeEach(() => {
    setActivePinia(createPinia())
    customerStore = useCustomerStore()
    formStore = useFormStore()
  })

  describe('Customer form get VM', () => {
    describe.each([
      {
        customer: lucasLefevre
      },
      {
        customer: sophieMartinez
      },
      {
        customer: elodieDurand
      }
    ])('Initial VM', ({ customer }) => {
      beforeEach(() => {
        customerStore.current = customer
        vm = customerFormGetVM(key)
      })
      describe.each([
        { field: 'firstname', expected: customer.firstname },
        { field: 'lastname', expected: customer.lastname },
        { field: 'email', expected: customer.email },
        { field: 'phone', expected: customer.phone }
      ])('Initial field value', ({ field, expected }) => {
        it(`should have ${field} to be "${expected}"`, () => {
          const expectedField: Field<any> = {
            value: expected,
            canEdit: false
          }
          expect(vm.get(field)).toStrictEqual(expectedField)
        })
        it(`should save the ${field} value in form store`, () => {
          expect(formStore.get(key)[field]).toStrictEqual(expected)
        })
      })
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
})
