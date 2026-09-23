import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import {
  isVoucherExpired,
  Voucher,
  VoucherStatus
} from '@core/entities/voucher'
import { DateProvider } from '@core/gateways/dateProvider'
import { Timestamp } from '@core/types/types'
import { useVoucherStore } from '@store/voucherStore'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'
import { voucherCustomerLabel } from '../voucher-form/voucherCustomerLabel'

export interface GetVouchersItemVM {
  uuid: string
  code: string
  customer: string
  amount: string
  expirationDate: string
  expirationDatetime: Date
  usedAt: string
  usedAtDatetime: Date
  isExpired: boolean
}

export interface VoucherTabVM {
  status: VoucherStatus
  labelKey: string
  headers: Array<Header>
  items: Array<GetVouchersItemVM>
  hasMore: boolean
}

export interface GetVouchersVM {
  tabs: Array<VoucherTabVM>
  isLoading: boolean
}

const commonHeaders: Array<Header> = [
  { name: 'voucher.headers.code', value: 'code' },
  { name: 'voucher.headers.customer', value: 'customer' },
  { name: 'voucher.headers.amount', value: 'amount' }
]

const tabs: Array<Pick<VoucherTabVM, 'status' | 'labelKey' | 'headers'>> = [
  {
    status: VoucherStatus.Unused,
    labelKey: 'voucher.tabs.unused',
    headers: [
      ...commonHeaders,
      { name: 'voucher.headers.expirationDate', value: 'expirationDate' }
    ]
  },
  {
    status: VoucherStatus.Used,
    labelKey: 'voucher.tabs.used',
    headers: [
      ...commonHeaders,
      { name: 'voucher.headers.usedAt', value: 'usedAt' }
    ]
  }
]

const formattedDate = (timestamp?: Timestamp): string =>
  timestamp ? timestampToLocaleString(timestamp, 'fr-FR') : ''

const toItemVM = (voucher: Voucher, now: Timestamp): GetVouchersItemVM => {
  const formatter = priceFormatter('fr-FR', 'EUR')
  return {
    uuid: voucher.uuid,
    code: voucher.code,
    customer: voucherCustomerLabel(voucher.customer),
    amount: formatter.format(voucher.amount / 100),
    expirationDate: formattedDate(voucher.expirationDate),
    expirationDatetime: new Date(voucher.expirationDate || ''),
    usedAt: formattedDate(voucher.usedAt),
    usedAtDatetime: new Date(voucher.usedAt || ''),
    isExpired: isVoucherExpired(voucher, now)
  }
}

export const getVouchersVM = (dateProvider: DateProvider): GetVouchersVM => {
  const voucherStore = useVoucherStore()
  const now = dateProvider.now()
  return {
    tabs: tabs.map((tab) => ({
      ...tab,
      items: voucherStore.items[tab.status].map((voucher) =>
        toItemVM(voucher, now)
      ),
      hasMore: voucherStore.hasMore[tab.status]
    })),
    isLoading: voucherStore.isLoading
  }
}
