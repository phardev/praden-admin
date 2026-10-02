import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { ReductionType } from '@core/entities/promotion'
import { PromotionScope } from '@core/entities/promotionCode'
import { WelcomeCode, WelcomeCodeStatus } from '@core/entities/welcomeCode'
import { useWelcomeCodeStore } from '@store/welcomeCodeStore'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'

const FULL_PERCENTAGE = 100

export interface TranslatedLabelVM {
  key: string
  params: Record<string, string>
}

export interface WelcomeCodeStatusVM {
  key: string
  color: string
}

export interface WelcomeCodeItemVM {
  uuid: string
  code: string
  discount: TranslatedLabelVM
  minimumAmount: string
  period: TranslatedLabelVM
  status: WelcomeCodeStatusVM
  sentCount: string
  usedCount: string
  conversionRate: string
  isActive: boolean
}

export interface GetWelcomeCodesVM {
  headers: Array<Header>
  items: Array<WelcomeCodeItemVM>
  sentCode: WelcomeCodeItemVM | undefined
  isLoading: boolean
  isSaving: boolean
}

const headers: Array<Header> = [
  { name: 'welcomeCode.headers.code', value: 'code' },
  { name: 'welcomeCode.headers.discount', value: 'discount' },
  { name: 'welcomeCode.headers.minimumAmount', value: 'minimumAmount' },
  { name: 'welcomeCode.headers.period', value: 'period' },
  { name: 'welcomeCode.headers.status', value: 'status' },
  { name: 'welcomeCode.headers.sentCount', value: 'sentCount' },
  { name: 'welcomeCode.headers.usedCount', value: 'usedCount' },
  { name: 'welcomeCode.headers.conversionRate', value: 'conversionRate' },
  { name: 'welcomeCode.headers.actions', value: 'actions' }
]

const statusColors: Record<WelcomeCodeStatus, string> = {
  [WelcomeCodeStatus.Sent]: 'green',
  [WelcomeCodeStatus.Usable]: 'blue',
  [WelcomeCodeStatus.Scheduled]: 'orange',
  [WelcomeCodeStatus.Ended]: 'red',
  [WelcomeCodeStatus.Disabled]: 'gray'
}

const euros = (cents: number): string =>
  priceFormatter('fr-FR', 'EUR').format(cents / 100)

const formattedDate = (timestamp: number): string =>
  timestampToLocaleString(timestamp, 'fr-FR')

const formattedRate = (rate: number): string =>
  new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    maximumFractionDigits: 1
  }).format(rate)

const reductionOf = ({ reductionType, amount }: WelcomeCode): string =>
  reductionType === ReductionType.Percentage
    ? `-${amount} %`
    : `-${euros(amount)}`

const isFreeDelivery = (welcomeCode: WelcomeCode): boolean =>
  welcomeCode.scope === PromotionScope.Delivery &&
  welcomeCode.reductionType === ReductionType.Percentage &&
  welcomeCode.amount === FULL_PERCENTAGE

const discountOf = (welcomeCode: WelcomeCode): TranslatedLabelVM => {
  if (isFreeDelivery(welcomeCode)) {
    return { key: 'welcomeCode.discount.freeDelivery', params: {} }
  }
  const key =
    welcomeCode.scope === PromotionScope.Delivery
      ? 'welcomeCode.discount.delivery'
      : 'welcomeCode.discount.products'
  return { key, params: { reduction: reductionOf(welcomeCode) } }
}

const periodOf = ({ startDate, endDate }: WelcomeCode): TranslatedLabelVM => {
  if (startDate && endDate) {
    return {
      key: 'welcomeCode.period.between',
      params: { start: formattedDate(startDate), end: formattedDate(endDate) }
    }
  }
  if (startDate) {
    return {
      key: 'welcomeCode.period.from',
      params: { start: formattedDate(startDate) }
    }
  }
  if (endDate) {
    return {
      key: 'welcomeCode.period.until',
      params: { end: formattedDate(endDate) }
    }
  }
  return { key: 'welcomeCode.period.unlimited', params: {} }
}

const toItemVM = (welcomeCode: WelcomeCode): WelcomeCodeItemVM => ({
  uuid: welcomeCode.uuid,
  code: welcomeCode.code,
  discount: discountOf(welcomeCode),
  minimumAmount: welcomeCode.conditions.minimumAmount
    ? euros(welcomeCode.conditions.minimumAmount)
    : '',
  period: periodOf(welcomeCode),
  status: {
    key: `welcomeCode.status.${welcomeCode.status}`,
    color: statusColors[welcomeCode.status]
  },
  sentCount: String(welcomeCode.sentCount),
  usedCount: String(welcomeCode.usedCount),
  conversionRate:
    welcomeCode.conversionRate === undefined
      ? ''
      : formattedRate(welcomeCode.conversionRate),
  isActive: welcomeCode.isActive
})

export const getWelcomeCodesVM = (): GetWelcomeCodesVM => {
  const welcomeCodeStore = useWelcomeCodeStore()
  const items = welcomeCodeStore.items.map(toItemVM)
  const sentIndex = welcomeCodeStore.items.findIndex(
    (welcomeCode) => welcomeCode.status === WelcomeCodeStatus.Sent
  )
  return {
    headers,
    items,
    sentCode: items[sentIndex],
    isLoading: welcomeCodeStore.isLoading,
    isSaving: welcomeCodeStore.isSaving
  }
}
