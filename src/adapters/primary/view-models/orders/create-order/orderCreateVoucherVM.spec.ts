import type { Address } from '@core/entities/order'
import type { ApplyVoucherDTO } from '@core/usecases/vouchers/voucher-application/applyVoucher'
import { useVoucherStore } from '@store/voucherStore'
import { priceFormatter } from '@utils/formatters'
import { elodieDurand, lucasLefevre } from '@utils/testData/customers'
import { clickAndCollect, express } from '@utils/testData/deliveryMethods'
import { dolodent, ultraLevure } from '@utils/testData/products'
import { unusedVoucher } from '@utils/testData/vouchers'
import { createPinia, setActivePinia } from 'pinia'
import type { OrderCreateFormState } from './orderCreateFormState'
import { emptyOrderCreateFormState } from './orderCreateFormState'
import type { OrderCreateVoucherVM } from './orderCreateVoucherVM'
import {
  buildApplyVoucherDto,
  currentAppliedVoucher,
  orderCreateVoucherVM
} from './orderCreateVoucherVM'

describe('Order create voucher VM', () => {
  let voucherStore: ReturnType<typeof useVoucherStore>
  const formatter = priceFormatter('fr-FR', 'EUR')
  const deliveryAddress: Address = {
    firstname: elodieDurand.firstname,
    lastname: elodieDurand.lastname,
    address: '12 rue des Lilas',
    city: 'Alès',
    zip: '30100',
    country: 'France'
  }

  const readyFormState = (): OrderCreateFormState => ({
    ...emptyOrderCreateFormState(),
    customer: elodieDurand,
    lines: [{ product: dolodent, quantity: 2 }],
    deliveryMethod: express,
    deliveryAddress,
    voucherCode: ` ${unusedVoucher.code} `
  })

  const expectedApplyDto: ApplyVoucherDTO = {
    code: unusedVoucher.code,
    customerUuid: elodieDurand.uuid,
    lines: [{ productUuid: dolodent.uuid, quantity: 2 }],
    deliveryAddress,
    deliveryMethodUuid: express.uuid
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    voucherStore = useVoucherStore()
  })

  const givenVoucherIsApplied = () => {
    voucherStore.applyToManualOrder({
      request: expectedApplyDto,
      discount: unusedVoucher.amount
    })
  }

  describe('Given an empty form', () => {
    it('should not allow typing nor applying a voucher', () => {
      const expectedVM: OrderCreateVoucherVM = {
        canEditCode: false,
        canApply: false,
        isApplying: false
      }
      expect(orderCreateVoucherVM(emptyOrderCreateFormState())).toStrictEqual(
        expectedVM
      )
    })
  })

  describe('Given a customer, products and a delivery method without code', () => {
    it('should allow typing a code but not applying it', () => {
      const expectedVM: OrderCreateVoucherVM = {
        canEditCode: true,
        canApply: false,
        isApplying: false
      }
      expect(
        orderCreateVoucherVM({ ...readyFormState(), voucherCode: ' ' })
      ).toStrictEqual(expectedVM)
    })
  })

  describe('Given a typed code', () => {
    it('should allow applying it', () => {
      const expectedVM: OrderCreateVoucherVM = {
        canEditCode: true,
        canApply: true,
        isApplying: false
      }
      expect(orderCreateVoucherVM(readyFormState())).toStrictEqual(expectedVM)
    })

    it('should not allow applying it twice at the same time', () => {
      voucherStore.startApplying()
      const expectedVM: OrderCreateVoucherVM = {
        canEditCode: true,
        canApply: false,
        isApplying: true
      }
      expect(orderCreateVoucherVM(readyFormState())).toStrictEqual(expectedVM)
    })

    it('should build the application request with the trimmed code', () => {
      expect(buildApplyVoucherDto(readyFormState())).toStrictEqual(
        expectedApplyDto
      )
    })
  })

  describe('Given click and collect', () => {
    it('should send the billing address as delivery address', () => {
      const formState: OrderCreateFormState = {
        ...readyFormState(),
        deliveryMethod: clickAndCollect,
        billingAddress: { ...deliveryAddress, city: 'Nîmes' }
      }
      expect(buildApplyVoucherDto(formState)).toStrictEqual({
        ...expectedApplyDto,
        deliveryMethodUuid: clickAndCollect.uuid,
        deliveryAddress: { ...deliveryAddress, city: 'Nîmes' }
      })
    })
  })

  describe('Given the voucher is applied', () => {
    beforeEach(() => {
      givenVoucherIsApplied()
    })

    it('should display the applied voucher and its discount', () => {
      const expectedVM: OrderCreateVoucherVM = {
        canEditCode: true,
        canApply: true,
        isApplying: false,
        applied: {
          code: unusedVoucher.code,
          formattedDiscount: formatter.format(-unusedVoucher.amount / 100)
        }
      }
      expect(orderCreateVoucherVM(readyFormState())).toStrictEqual(expectedVM)
    })

    it('should keep the applied voucher while the order is unchanged', () => {
      expect(currentAppliedVoucher(readyFormState())).toStrictEqual({
        request: expectedApplyDto,
        discount: unusedVoucher.amount
      })
    })

    it.each([
      ['the customer', { customer: lucasLefevre }],
      [
        'the lines',
        {
          lines: [
            { product: dolodent, quantity: 2 },
            { product: ultraLevure, quantity: 1 }
          ]
        }
      ],
      ['a quantity', { lines: [{ product: dolodent, quantity: 3 }] }],
      ['the delivery method', { deliveryMethod: clickAndCollect }],
      ['the code', { voucherCode: 'ANOTHER-CODE' }]
    ])(
      'should forget the applied voucher when %s changes',
      (_label, change) => {
        expect(
          currentAppliedVoucher({ ...readyFormState(), ...change })
        ).toBeUndefined()
      }
    )
  })
})
