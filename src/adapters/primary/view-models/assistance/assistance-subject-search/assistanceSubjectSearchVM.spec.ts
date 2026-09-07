import { AssistanceSubjectType } from '@core/entities/assistanceRequest'
import { getTotalWithTax } from '@core/entities/order'
import { useCustomerStore } from '@store/customerStore'
import { useSearchStore } from '@store/searchStore'
import { formatCurrency, timestampToLocaleString } from '@utils/formatters'
import { elodieDurand, lucasLefevre } from '@utils/testData/customers'
import { lucasLefevreOrder1, orderToPrepare1 } from '@utils/testData/orders'
import { dolodent } from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'
import {
  type AssistanceSubjectSearchVM,
  assistanceSubjectSearchVM
} from './assistanceSubjectSearchVM'

describe('Assistance subject search VM', () => {
  let searchStore: ReturnType<typeof useSearchStore>
  const ordersNamespace = 'assistance-subject-orders'
  const productsNamespace = 'assistance-subject-products'
  const customersNamespace = 'assistance-subject-customers'

  const emptySearch = (namespace: string): AssistanceSubjectSearchVM => ({
    namespace,
    results: [],
    isLoading: false,
    isQueryTooShort: false,
    hasNoResults: false
  })

  beforeEach(() => {
    setActivePinia(createPinia())
    searchStore = useSearchStore()
  })

  describe('Given no search was made', () => {
    it('should expose an idle order search', () => {
      expect(
        assistanceSubjectSearchVM(AssistanceSubjectType.ORDER, '')
      ).toStrictEqual(emptySearch(ordersNamespace))
    })
  })

  describe('Given orders matching the query', () => {
    it('should map the orders to subject options', () => {
      searchStore.setFilter(ordersNamespace, { query: 'jean' })
      searchStore.set(ordersNamespace, [orderToPrepare1])
      expect(
        assistanceSubjectSearchVM(AssistanceSubjectType.ORDER, 'jean')
      ).toStrictEqual({
        ...emptySearch(ordersNamespace),
        results: [
          {
            uuid: orderToPrepare1.uuid,
            label: `${orderToPrepare1.deliveryAddress.firstname} ${orderToPrepare1.deliveryAddress.lastname}`,
            secondaryLabel: `${orderToPrepare1.contact.email} · ${timestampToLocaleString(orderToPrepare1.createdAt, 'fr-FR')} · ${formatCurrency(getTotalWithTax(orderToPrepare1))}`,
            pageUrl: `/orders/${orderToPrepare1.uuid}`
          }
        ]
      })
    })
  })

  describe('Given a customer order matching the query', () => {
    it('should show the e-mail of the known customer', () => {
      useCustomerStore().items = [lucasLefevre]
      searchStore.setFilter(ordersNamespace, { query: 'lucas' })
      searchStore.set(ordersNamespace, [lucasLefevreOrder1])
      expect(
        assistanceSubjectSearchVM(AssistanceSubjectType.ORDER, 'lucas')
      ).toStrictEqual({
        ...emptySearch(ordersNamespace),
        results: [
          {
            uuid: lucasLefevreOrder1.uuid,
            label: `${lucasLefevreOrder1.deliveryAddress.firstname} ${lucasLefevreOrder1.deliveryAddress.lastname}`,
            secondaryLabel: `${lucasLefevre.email} · ${timestampToLocaleString(lucasLefevreOrder1.createdAt, 'fr-FR')} · ${formatCurrency(getTotalWithTax(lucasLefevreOrder1))}`,
            pageUrl: `/orders/${lucasLefevreOrder1.uuid}`
          }
        ]
      })
    })

    it('should omit the e-mail when the customer is unknown', () => {
      searchStore.setFilter(ordersNamespace, { query: 'lucas' })
      searchStore.set(ordersNamespace, [lucasLefevreOrder1])
      expect(
        assistanceSubjectSearchVM(AssistanceSubjectType.ORDER, 'lucas')
          .results[0].secondaryLabel
      ).toBe(
        `${timestampToLocaleString(lucasLefevreOrder1.createdAt, 'fr-FR')} · ${formatCurrency(getTotalWithTax(lucasLefevreOrder1))}`
      )
    })
  })

  describe('Given products matching the query', () => {
    it('should map the products to subject options', () => {
      searchStore.setFilter(productsNamespace, { query: 'dolo' })
      searchStore.set(productsNamespace, [dolodent])
      expect(
        assistanceSubjectSearchVM(AssistanceSubjectType.PRODUCT, 'dolo')
      ).toStrictEqual({
        ...emptySearch(productsNamespace),
        results: [
          {
            uuid: dolodent.uuid,
            label: dolodent.name,
            secondaryLabel: dolodent.ean13,
            pageUrl: `/products/get/${dolodent.uuid}`
          }
        ]
      })
    })
  })

  describe('Given customers matching the query', () => {
    it('should map the customers to subject options', () => {
      searchStore.setFilter(customersNamespace, { query: 'elo' })
      searchStore.set(customersNamespace, [elodieDurand])
      expect(
        assistanceSubjectSearchVM(AssistanceSubjectType.CUSTOMER, 'elo')
      ).toStrictEqual({
        ...emptySearch(customersNamespace),
        results: [
          {
            uuid: elodieDurand.uuid,
            label: `${elodieDurand.firstname} ${elodieDurand.lastname}`,
            secondaryLabel: elodieDurand.email,
            pageUrl: `/customers/get/${elodieDurand.uuid}`
          }
        ]
      })
    })
  })

  describe('Given the query is too short', () => {
    it('should tell the query is too short', () => {
      searchStore.setFilter(ordersNamespace, { query: 'je' })
      searchStore.setError(ordersNamespace, 'query is too short')
      expect(
        assistanceSubjectSearchVM(AssistanceSubjectType.ORDER, 'je')
      ).toStrictEqual({
        ...emptySearch(ordersNamespace),
        isQueryTooShort: true
      })
    })
  })

  describe('Given the search is in progress', () => {
    it('should be loading', () => {
      searchStore.setFilter(customersNamespace, { query: 'elo' })
      searchStore.startLoading(customersNamespace)
      expect(
        assistanceSubjectSearchVM(AssistanceSubjectType.CUSTOMER, 'elo')
      ).toStrictEqual({
        ...emptySearch(customersNamespace),
        isLoading: true
      })
    })
  })

  describe('Given the search returned nothing', () => {
    it('should tell there are no results', () => {
      searchStore.setFilter(productsNamespace, { query: 'zzz' })
      searchStore.set(productsNamespace, [])
      expect(
        assistanceSubjectSearchVM(AssistanceSubjectType.PRODUCT, 'zzz')
      ).toStrictEqual({
        ...emptySearch(productsNamespace),
        hasNoResults: true
      })
    })
  })

  describe('Given the stored results belong to a previous query', () => {
    it('should hide the stale results', () => {
      searchStore.setFilter(ordersNamespace, { query: 'jean' })
      searchStore.set(ordersNamespace, [orderToPrepare1])
      expect(
        assistanceSubjectSearchVM(AssistanceSubjectType.ORDER, 'jeann')
      ).toStrictEqual(emptySearch(ordersNamespace))
    })
  })
})
