import {
  GetCustomersItemVM,
  GetCustomersVM,
  getCustomersVM
} from '@adapters/primary/view-models/customers/get-customers/getCustomersVM'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { Customer } from '@core/entities/customer'
import { useCustomerStore } from '@store/customerStore'
import { useSearchStore } from '@store/searchStore'
import {
  elodieDurand,
  lucasLefevre,
  sophieMartinez
} from '@utils/testData/customers'
import { createPinia, setActivePinia } from 'pinia'

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
  },
  {
    name: 'Abonnement newsletter',
    value: 'newsletterSubscription'
  },
  {
    name: 'Nombre de commandes',
    value: 'ordersCount'
  },
  {
    name: 'Total des commandes',
    value: 'ordersTotal'
  }
]

describe('Get customers VM', () => {
  let customerStore: any
  let searchStore: any
  const key = 'index-customers'

  beforeEach(() => {
    setActivePinia(createPinia())
    customerStore = useCustomerStore()
    searchStore = useSearchStore()
  })

  describe('There is no customers', () => {
    it('should return an empty VM', () => {
      const expectedVM: Partial<GetCustomersVM> = {
        headers: expectedHeaders,
        items: []
      }
      expectVMToMatch(expectedVM)
    })
  })
  describe('There is some customers', () => {
    describe('There is no filter', () => {
      it('should create the vm for the customers', () => {
        const existingCustomers = [elodieDurand, lucasLefevre, sophieMartinez]
        givenExistingCustomers(...existingCustomers)
        const expectedVM: Partial<GetCustomersVM> = {
          headers: expectedHeaders,
          items: existingCustomers.map((customer) =>
            createCustomerItemVM(customer)
          )
        }
        expectVMToMatch(expectedVM)
      })
      it('should create the vm for the customers and there is more', () => {
        const existingCustomers = [elodieDurand, lucasLefevre, sophieMartinez]
        customerStore.hasMore = true
        givenExistingCustomers(...existingCustomers)
        const expectedVM: Partial<GetCustomersVM> = {
          headers: expectedHeaders,
          items: existingCustomers.map((customer) =>
            createCustomerItemVM(customer)
          ),
          hasMore: true
        }
        expectVMToMatch(expectedVM)
      })
    })
    describe('There is some filters', () => {
      it('should get all search result customers vm', () => {
        const existingCustomers = [elodieDurand, lucasLefevre, sophieMartinez]
        givenExistingCustomers(...existingCustomers)
        searchStore.set(key, [lucasLefevre, sophieMartinez])
        const expectedVM: Partial<GetCustomersVM> = {
          headers: expectedHeaders,
          items: [lucasLefevre, sophieMartinez].map((customer) =>
            createCustomerItemVM(customer)
          )
        }
        expectVMToMatch(expectedVM)
      })
      it('should get all search filters', () => {
        searchStore.setFilter(key, {
          query: 'test'
        })
        const expectedVM: Partial<GetCustomersVM> = {
          currentSearch: {
            query: 'test'
          }
        }
        expectVMToMatch(expectedVM)
      })
    })
  })
  describe('There is an error in search', () => {
    beforeEach(() => {
      searchStore.setError(key, 'dol')
    })
    it('should display the error', () => {
      const expectedVM: Partial<GetCustomersVM> = {
        searchError:
          'Veuillez saisir au moins 3 caractères pour lancer la recherche.'
      }
      expectVMToMatch(expectedVM)
    })
  })

  const givenExistingCustomers = (...customers: Array<Customer>) => {
    customerStore.items = customers
  }

  const expectVMToMatch = (expectedVM: Partial<GetCustomersVM>) => {
    const emptyVM: GetCustomersVM = {
      headers: expectedHeaders,
      items: [],
      isLoading: false,
      hasMore: false,
      currentSearch: undefined,
      searchError: undefined
    }
    expect(getCustomersVM(key)).toMatchObject({ ...emptyVM, ...expectedVM })
  }

  const createCustomerItemVM = (customer: Customer): GetCustomersItemVM => {
    const formatter = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    })
    return {
      uuid: customer.uuid,
      firstname: customer.firstname,
      lastname: customer.lastname,
      email: customer.email,
      phone: customer.phone,
      newsletterSubscription: !!customer.newsletterSubscription,
      ordersCount: customer.ordersCount,
      ordersTotal: formatter.format(customer.ordersTotal / 100)
    }
  }
})
