import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { Voucher, VoucherStatus } from '@core/entities/voucher'
import { useVoucherStore } from '@store/voucherStore'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'
import {
  expiredVoucher,
  unusedVoucher,
  usedVoucher,
  voucherFixturesNow,
  voucherWithoutExpirationDate
} from '@utils/testData/vouchers'
import { createPinia, setActivePinia } from 'pinia'
import type { GetVouchersItemVM, GetVouchersVM } from './getVouchersVM'
import { getVouchersVM } from './getVouchersVM'

describe('Get vouchers VM', () => {
  let voucherStore: ReturnType<typeof useVoucherStore>
  const dateProvider = new FakeDateProvider()
  const formatter = priceFormatter('fr-FR', 'EUR')

  const unusedHeaders = [
    { name: 'voucher.headers.code', value: 'code' },
    { name: 'voucher.headers.customer', value: 'customer' },
    { name: 'voucher.headers.amount', value: 'amount' },
    { name: 'voucher.headers.expirationDate', value: 'expirationDate' }
  ]

  const usedHeaders = [
    { name: 'voucher.headers.code', value: 'code' },
    { name: 'voucher.headers.customer', value: 'customer' },
    { name: 'voucher.headers.amount', value: 'amount' },
    { name: 'voucher.headers.usedAt', value: 'usedAt' }
  ]

  const expectedItem = (
    voucher: Voucher,
    isExpired: boolean
  ): GetVouchersItemVM => ({
    uuid: voucher.uuid,
    code: voucher.code,
    customer: `${voucher.customer.firstname} ${voucher.customer.lastname}`,
    amount: formatter.format(voucher.amount / 100),
    expirationDate: voucher.expirationDate
      ? timestampToLocaleString(voucher.expirationDate, 'fr-FR')
      : '',
    expirationDatetime: new Date(voucher.expirationDate || ''),
    usedAt: voucher.usedAt
      ? timestampToLocaleString(voucher.usedAt, 'fr-FR')
      : '',
    usedAtDatetime: new Date(voucher.usedAt || ''),
    isExpired
  })

  beforeEach(() => {
    setActivePinia(createPinia())
    voucherStore = useVoucherStore()
    dateProvider.feedWith(voucherFixturesNow)
  })

  describe('Given there is no voucher', () => {
    it('should display both tabs empty', () => {
      const expectedVM: GetVouchersVM = {
        tabs: [
          {
            status: VoucherStatus.Unused,
            labelKey: 'voucher.tabs.unused',
            headers: unusedHeaders,
            items: [],
            hasMore: false
          },
          {
            status: VoucherStatus.Used,
            labelKey: 'voucher.tabs.used',
            headers: usedHeaders,
            items: [],
            hasMore: false
          }
        ],
        isLoading: false
      }
      expect(getVouchersVM(dateProvider)).toStrictEqual(expectedVM)
    })
  })

  describe('Given some vouchers are listed', () => {
    beforeEach(() => {
      voucherStore.list(VoucherStatus.Unused, [
        unusedVoucher,
        voucherWithoutExpirationDate,
        expiredVoucher
      ])
      voucherStore.setHasMore(VoucherStatus.Unused, true)
      voucherStore.list(VoucherStatus.Used, [usedVoucher])
    })

    it('should display each voucher in the tab of its status', () => {
      const expectedVM: GetVouchersVM = {
        tabs: [
          {
            status: VoucherStatus.Unused,
            labelKey: 'voucher.tabs.unused',
            headers: unusedHeaders,
            items: [
              expectedItem(unusedVoucher, false),
              expectedItem(voucherWithoutExpirationDate, false),
              expectedItem(expiredVoucher, true)
            ],
            hasMore: true
          },
          {
            status: VoucherStatus.Used,
            labelKey: 'voucher.tabs.used',
            headers: usedHeaders,
            items: [expectedItem(usedVoucher, false)],
            hasMore: false
          }
        ],
        isLoading: false
      }
      expect(getVouchersVM(dateProvider)).toStrictEqual(expectedVM)
    })
  })

  describe('Given a customer without name', () => {
    it('should display the customer email', () => {
      const anonymousCustomer = {
        uuid: 'anonymous',
        email: 'anonymous@mail.com'
      }
      voucherStore.list(VoucherStatus.Unused, [
        { ...unusedVoucher, customer: anonymousCustomer }
      ])
      expect(
        getVouchersVM(dateProvider).tabs[0].items[0].customer
      ).toStrictEqual(anonymousCustomer.email)
    })
  })

  describe('Loading', () => {
    it('should be aware of loading', () => {
      voucherStore.startLoading()
      expect(getVouchersVM(dateProvider).isLoading).toBe(true)
    })
  })
})
