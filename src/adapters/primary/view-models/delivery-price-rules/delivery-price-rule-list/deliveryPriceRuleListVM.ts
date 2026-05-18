import {
  computeDeliveryPriceRuleStatus,
  type DeliveryPriceRule,
  type DeliveryPriceRuleStatus
} from '@core/entities/deliveryPriceRule'
import type { DateProvider } from '@core/gateways/dateProvider'
import type { Timestamp } from '@core/types/types'
import { useDeliveryMethodStore } from '@store/deliveryMethodStore'
import { useDeliveryPriceRuleStore } from '@store/deliveryPriceRuleStore'
import { formatCurrency, timestampToLocaleString } from '@utils/formatters'

export interface DeliveryPriceRuleListItemVM {
  uuid: string
  name: string
  deliveryMethodUuid: string
  deliveryMethodName: string
  formattedPrice: string
  formattedMinOrderValue: string
  formattedMaxWeight: string
  formattedDateRange: string
  priority: number
  status: DeliveryPriceRuleStatus
}

const formatWeight = (weightInGrams: number): string => {
  return `${weightInGrams / 1000} kg`
}

const formatDateRange = (
  startDate: number | null,
  endDate: number | null
): string => {
  if (!startDate && !endDate) return '-'

  const start = startDate ? timestampToLocaleString(startDate, 'fr-FR') : ''
  const end = endDate ? timestampToLocaleString(endDate, 'fr-FR') : ''

  if (start && end) return `${start} - ${end}`
  if (start) return `À partir du ${start}`
  if (end) return `Jusqu'au ${end}`

  return '-'
}

const mapToVM = (
  rule: DeliveryPriceRule,
  deliveryMethodName: string,
  now: Timestamp
): DeliveryPriceRuleListItemVM => {
  return {
    uuid: rule.uuid,
    name: rule.name,
    deliveryMethodUuid: rule.deliveryMethodUuid,
    deliveryMethodName,
    formattedPrice: formatCurrency(rule.price / 100),
    formattedMinOrderValue: formatCurrency(rule.minOrderValue / 100),
    formattedMaxWeight: formatWeight(rule.maxWeight),
    formattedDateRange: formatDateRange(rule.startDate, rule.endDate),
    priority: rule.priority,
    status: computeDeliveryPriceRuleStatus(rule, now)
  }
}

export const getDeliveryPriceRuleListVM = (
  dateProvider: DateProvider
): Array<DeliveryPriceRuleListItemVM> => {
  const deliveryPriceRuleStore = useDeliveryPriceRuleStore()
  const deliveryMethodStore = useDeliveryMethodStore()
  const now = dateProvider.now()

  const rules = [...deliveryPriceRuleStore.items].sort(
    (a, b) => b.priority - a.priority
  )

  return rules.map((rule) => {
    const deliveryMethod = deliveryMethodStore.items.find(
      (dm) => dm.uuid === rule.deliveryMethodUuid
    )
    const deliveryMethodName = deliveryMethod?.name || ''
    return mapToVM(rule, deliveryMethodName, now)
  })
}
