import { createPinia, setActivePinia } from 'pinia'
import { useCustomerStore } from '@store/customerStore'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import {
  GetCustomersItemVM,
  getCustomersVM,
  GetCustomersVM
} from '@adapters/primary/view-models/customers/get-customers/getCustomersVM'
import {
  elodieDurand,
  lucasLefevre,
  sophieMartinez
} from '@utils/testData/customers'
import { Customer } from '@core/entities/customer'

const expectedHeaders: Array<Header> = [
  {
    name: 'Prénom',
    value: 'firstname'
  },
  {
    name: 'Nom',
    value: 'lastname'
  },
  {
    name: 'E-mail',
    value: 'email'
  },
  {
    name: 'Téléphone',
    value: 'phone'
  }
]

describe('Get customers VM', () => {
  let customerStore: any
  let vm: GetCustomersVM

  beforeEach(() => {
    setActivePinia(createPinia())
    customerStore = useCustomerStore()
  })

  describe('There is no customers', () => {
    it('should return an empty VM', () => {
      vm = getCustomersVM()
      const expectedVM: GetCustomersVM = {
        headers: expectedHeaders,
        items: []
      }
      expectVMToEqual(expectedVM)
    })
  })
  describe('There is some customers', () => {
    it('should create the vm for the customers', () => {
      const existingCustomers = [elodieDurand, lucasLefevre, sophieMartinez]
      givenExistingCustomers(...existingCustomers)
      vm = getCustomersVM()
      const expectedVM: GetCustomersVM = {
        headers: expectedHeaders,
        items: existingCustomers.map((customer) =>
          createCustomerItemVM(customer)
        )
      }
      expectVMToEqual(expectedVM)
    })
  })

  const givenExistingCustomers = (...customers: Array<Customer>) => {
    customerStore.items = customers
  }

  const expectVMToEqual = (expected: GetCustomersVM) => {
    expect(vm).toStrictEqual(expected)
  }

  const createCustomerItemVM = (customer: Customer): GetCustomersItemVM => {
    return {
      uuid: customer.uuid,
      firstname: customer.firstname,
      lastname: customer.lastname,
      email: customer.email,
      phone: customer.phone
    }
  }
})
