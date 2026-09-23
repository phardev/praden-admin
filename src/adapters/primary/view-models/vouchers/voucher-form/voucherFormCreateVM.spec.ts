import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { CreateVoucherDTO, VoucherCustomer } from '@core/entities/voucher'
import { useSearchStore } from '@store/searchStore'
import { useVoucherStore } from '@store/voucherStore'
import { timestampToLocaleString } from '@utils/formatters'
import { elodieDurand, lucasLefevre } from '@utils/testData/customers'
import { unusedVoucher, voucherFixturesNow } from '@utils/testData/vouchers'
import { createPinia, setActivePinia } from 'pinia'
import {
  VOUCHER_CUSTOMER_SEARCH_NAMESPACE,
  VoucherFormCreateVM,
  voucherFormCreateVM
} from './voucherFormCreateVM'

describe('Voucher form create VM', () => {
  const key = 'voucher-create'
  const dateProvider = new FakeDateProvider()
  let vm: VoucherFormCreateVM
  let voucherStore: ReturnType<typeof useVoucherStore>

  const elodieDurandVoucherCustomer: VoucherCustomer = {
    uuid: elodieDurand.uuid,
    email: elodieDurand.email,
    firstname: elodieDurand.firstname,
    lastname: elodieDurand.lastname
  }
  const amountInEuros = unusedVoucher.amount / 100

  beforeEach(() => {
    setActivePinia(createPinia())
    voucherStore = useVoucherStore()
    dateProvider.feedWith(voucherFixturesNow)
    useSearchStore().set(VOUCHER_CUSTOMER_SEARCH_NAMESPACE, [
      elodieDurand,
      lucasLefevre
    ])
    vm = voucherFormCreateVM(key, dateProvider)
  })

  const givenCustomerIsSelected = () => {
    vm.set('customerUuid', elodieDurand.uuid)
  }

  describe('Initialization', () => {
    it('should start without customer', () => {
      expect(vm.get('customer')).toStrictEqual({
        value: undefined,
        canEdit: true
      })
    })

    it('should prefill the code with the suggested one', () => {
      voucherStore.setSuggestedCode(unusedVoucher.code)
      vm = voucherFormCreateVM(key, dateProvider)
      expect(vm.get('code')).toStrictEqual({
        value: unusedVoucher.code,
        canEdit: true
      })
    })
  })

  describe('Customer selection', () => {
    it('should select the customer found by the search', () => {
      givenCustomerIsSelected()
      expect(vm.get('customer')).toStrictEqual({
        value: elodieDurandVoucherCustomer,
        canEdit: true
      })
    })

    it('should not select a customer missing from the search', () => {
      givenCustomerIsSelected()
      vm.set('customerUuid', 'unknown-customer')
      expect(vm.getCustomer()).toBeUndefined()
    })

    it('should label the customer with its fullname', () => {
      givenCustomerIsSelected()
      expect(vm.getCustomerLabel()).toStrictEqual(
        `${elodieDurand.firstname} ${elodieDurand.lastname}`
      )
    })

    it('should have no label without customer', () => {
      expect(vm.getCustomerLabel()).toStrictEqual('')
    })
  })

  describe('Expiration date', () => {
    it('should forbid dates before today', () => {
      const startOfToday = new Date(voucherFixturesNow).setHours(0, 0, 0, 0)
      expect(vm.getMinExpirationDate()).toStrictEqual(startOfToday)
    })

    it('should label the chosen expiration date', () => {
      vm.set('expirationDate', unusedVoucher.expirationDate)
      expect(vm.getExpirationDateLabel()).toStrictEqual(
        timestampToLocaleString(unusedVoucher.expirationDate!, 'fr-FR')
      )
    })

    it('should have no label without expiration date', () => {
      expect(vm.getExpirationDateLabel()).toStrictEqual('')
    })
  })

  describe('Validation', () => {
    it('should explain that a customer and a positive amount are required', () => {
      expect(vm.getValidationHints()).toStrictEqual([
        'voucher.hints.selectCustomer',
        'voucher.hints.amountMustBePositive'
      ])
    })

    it('should explain that a zero amount is refused', () => {
      givenCustomerIsSelected()
      vm.set('amount', 0)
      expect(vm.getValidationHints()).toStrictEqual([
        'voucher.hints.amountMustBePositive'
      ])
    })

    it('should explain that a negative amount is refused', () => {
      givenCustomerIsSelected()
      vm.set('amount', -amountInEuros)
      expect(vm.getValidationHints()).toStrictEqual([
        'voucher.hints.amountMustBePositive'
      ])
    })

    it('should not validate without a customer', () => {
      vm.set('amount', amountInEuros)
      expect(vm.getCanValidate()).toBe(false)
    })

    it('should validate with a customer and a positive amount', () => {
      givenCustomerIsSelected()
      vm.set('amount', amountInEuros)
      expect(vm.getCanValidate()).toBe(true)
    })

    it('should not validate while saving', () => {
      givenCustomerIsSelected()
      vm.set('amount', amountInEuros)
      voucherStore.startSaving()
      expect(vm.getCanValidate()).toBe(false)
    })

    it('should be aware of saving', () => {
      voucherStore.startSaving()
      expect(vm.isSaving()).toBe(true)
    })
  })

  describe('DTO', () => {
    beforeEach(() => {
      givenCustomerIsSelected()
      vm.set('amount', amountInEuros)
      vm.set('code', unusedVoucher.code)
    })

    it('should send the amount in cents without expiration date', () => {
      const expectedDTO: CreateVoucherDTO = {
        amount: unusedVoucher.amount,
        customerUuid: elodieDurand.uuid,
        code: unusedVoucher.code
      }
      expect(vm.getDto()).toStrictEqual(expectedDTO)
    })

    it('should send the expiration date when there is one', () => {
      vm.set('expirationDate', unusedVoucher.expirationDate)
      const expectedDTO: CreateVoucherDTO = {
        amount: unusedVoucher.amount,
        customerUuid: elodieDurand.uuid,
        code: unusedVoucher.code,
        expirationDate: unusedVoucher.expirationDate
      }
      expect(vm.getDto()).toStrictEqual(expectedDTO)
    })

    it('should not send a code when the field is empty', () => {
      vm.set('code', '')
      const expectedDTO: CreateVoucherDTO = {
        amount: unusedVoucher.amount,
        customerUuid: elodieDurand.uuid
      }
      expect(vm.getDto()).toStrictEqual(expectedDTO)
    })
  })
})
