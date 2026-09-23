import { useSearchStore } from '@store/searchStore'
import { elodieDurand, lucasLefevre } from '@utils/testData/customers'
import { customerLoyaltyWithTransactions } from '@utils/testData/loyaltyPointsTransactions'
import { unusedVoucher } from '@utils/testData/vouchers'
import { createPinia, setActivePinia } from 'pinia'
import type { CustomerSearchVM } from './customerSearchVM'
import { customerSearchVM } from './customerSearchVM'

describe('Customer search VM', () => {
  let searchStore: ReturnType<typeof useSearchStore>
  const namespace = 'customer-search'
  const customerWithoutPhone = { ...lucasLefevre, phone: '' }

  beforeEach(() => {
    setActivePinia(createPinia())
    searchStore = useSearchStore()
  })

  describe('Given no search yet', () => {
    it('should return empty results', () => {
      const expectedVM: CustomerSearchVM = {
        results: [],
        isLoading: false,
        hasError: false,
        hasSearchedQuery: false
      }
      expect(customerSearchVM(namespace)).toStrictEqual(expectedVM)
    })
  })

  describe('Given search results', () => {
    it('should display the phone next to the email only when the customer has one', () => {
      searchStore.set(namespace, [elodieDurand, customerWithoutPhone])
      searchStore.setFilter(namespace, { query: elodieDurand.lastname })
      const expectedVM: CustomerSearchVM = {
        results: [
          {
            uuid: elodieDurand.uuid,
            fullname: `${elodieDurand.firstname} ${elodieDurand.lastname}`,
            contact: `${elodieDurand.email} · ${elodieDurand.phone}`
          },
          {
            uuid: customerWithoutPhone.uuid,
            fullname: `${customerWithoutPhone.firstname} ${customerWithoutPhone.lastname}`,
            contact: customerWithoutPhone.email
          }
        ],
        isLoading: false,
        hasError: false,
        hasSearchedQuery: true
      }
      expect(customerSearchVM(namespace)).toStrictEqual(expectedVM)
    })
  })

  describe('Given a search with no result', () => {
    it('should tell that the query has been searched', () => {
      searchStore.set(namespace, [])
      searchStore.setFilter(namespace, { query: elodieDurand.lastname })
      const expectedVM: CustomerSearchVM = {
        results: [],
        isLoading: false,
        hasError: false,
        hasSearchedQuery: true
      }
      expect(customerSearchVM(namespace)).toStrictEqual(expectedVM)
    })
  })

  describe('Given a search in progress', () => {
    it('should be loading and not yet searched', () => {
      searchStore.setFilter(namespace, { query: elodieDurand.lastname })
      searchStore.startLoading(namespace)
      const expectedVM: CustomerSearchVM = {
        results: [],
        isLoading: true,
        hasError: false,
        hasSearchedQuery: false
      }
      expect(customerSearchVM(namespace)).toStrictEqual(expectedVM)
    })
  })

  describe('Given a search error', () => {
    it('should have an error and not be searched', () => {
      searchStore.setFilter(namespace, { query: 'du' })
      searchStore.setError(namespace, 'minimum query length')
      const expectedVM: CustomerSearchVM = {
        results: [],
        isLoading: false,
        hasError: true,
        hasSearchedQuery: false
      }
      expect(customerSearchVM(namespace)).toStrictEqual(expectedVM)
    })
  })

  describe('Given a selected customer', () => {
    it('should display the selected customer with the phone', () => {
      const expectedVM: CustomerSearchVM = {
        results: [],
        selected: {
          fullname: `${elodieDurand.firstname} ${elodieDurand.lastname}`,
          contact: `${elodieDurand.email} · ${elodieDurand.phone}`
        },
        isLoading: false,
        hasError: false,
        hasSearchedQuery: false
      }
      expect(customerSearchVM(namespace, elodieDurand)).toStrictEqual(
        expectedVM
      )
    })

    it('should display only the email when the selected customer has no phone', () => {
      const voucherCustomer = unusedVoucher.customer
      const expectedVM: CustomerSearchVM = {
        results: [],
        selected: {
          fullname: `${voucherCustomer.firstname} ${voucherCustomer.lastname}`,
          contact: voucherCustomer.email
        },
        isLoading: false,
        hasError: false,
        hasSearchedQuery: false
      }
      expect(customerSearchVM(namespace, voucherCustomer)).toStrictEqual(
        expectedVM
      )
    })

    it('should display the loyalty balance when the selected customer has one', () => {
      const loyalCustomer = {
        ...elodieDurand,
        loyalty: customerLoyaltyWithTransactions
      }
      const expectedVM: CustomerSearchVM = {
        results: [],
        selected: {
          fullname: `${loyalCustomer.firstname} ${loyalCustomer.lastname}`,
          contact: `${loyalCustomer.email} · ${loyalCustomer.phone}`,
          loyaltyBalance: customerLoyaltyWithTransactions.balance
        },
        isLoading: false,
        hasError: false,
        hasSearchedQuery: false
      }
      expect(customerSearchVM(namespace, loyalCustomer)).toStrictEqual(
        expectedVM
      )
    })
  })
})
