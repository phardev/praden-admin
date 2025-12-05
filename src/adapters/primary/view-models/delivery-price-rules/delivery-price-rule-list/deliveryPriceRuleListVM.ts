import type { DeliveryPriceRule } from '@core/entities/deliveryPriceRule'
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
  isActive: boolean
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
  deliveryMethodName: string
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
    isActive: rule.isActive
  }
}

export const getDeliveryPriceRuleListVM =
  (): Array<DeliveryPriceRuleListItemVM> => {
    const deliveryPriceRuleStore = useDeliveryPriceRuleStore()
    const deliveryMethodStore = useDeliveryMethodStore()

    const rules = [...deliveryPriceRuleStore.items].sort(
      (a, b) => a.priority - b.priority
    )

    return rules.map((rule) => {
      const deliveryMethod = deliveryMethodStore.items.find(
        (dm) => dm.uuid === rule.deliveryMethodUuid
      )
      const deliveryMethodName = deliveryMethod?.name || ''
      return mapToVM(rule, deliveryMethodName)
    })
  }
