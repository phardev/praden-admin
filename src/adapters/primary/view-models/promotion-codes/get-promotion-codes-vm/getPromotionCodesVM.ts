import { TableVM } from '@adapters/primary/view-models/invoices/get-invoice/getInvoiceVM'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { ReductionType } from '@core/entities/promotion'
import {
  isPromotionCodeEnded,
  isPromotionCodeInProgress,
  isPromotionCodeStarted,
  PromotionCode
} from '@core/entities/promotionCode'
import { DateProvider } from '@core/gateways/dateProvider'
import { HashTable, Timestamp } from '@core/types/types'
import { usePromotionCodeStore } from '@store/promotionCodeStore'
import {
  percentFormatter,
  priceFormatter,
  timestampToLocaleString
} from '@utils/formatters'

export interface GetPromotionCodesItemVM {
  uuid: string
  code: string
  amount: string
  startDate: string
  startDatetime: Date
  endDate: string
  endDatetime: Date
  currentUses: number
}

interface GetPromotionCodesGroupVM {
  count: number
  table: TableVM<GetPromotionCodesItemVM>
}

export interface GetPromotionCodesVM {
  items: HashTable<GetPromotionCodesGroupVM>
  isLoading: boolean
}

export const getPromotionCodesVM = (
  dateProvider: DateProvider
): GetPromotionCodesVM => {
  const groups = [
    {
      name: 'En cours',
      filter: inProgressFilter
    },
    {
      name: 'Terminé',
      filter: endedFilter
    },
    {
      name: 'À venir',
      filter: incomingFilter
    }
  ]
  return filterPromotionCodesByGroup(groups, dateProvider.now())
}

const inProgressFilter =
  (now: Timestamp) =>
  (p: PromotionCode): boolean => {
    return isPromotionCodeInProgress(p, now)
  }

const endedFilter =
  (now: Timestamp) =>
  (p: PromotionCode): boolean => {
    return isPromotionCodeEnded(p, now)
  }

const incomingFilter =
  (now: Timestamp) =>
  (p: PromotionCode): boolean => {
    return !isPromotionCodeStarted(p, now)
  }

const promotionCodesVMHeaders: Array<Header> = [
  {
    name: 'Code',
    value: 'code'
  },
  {
    name: 'Montant',
    value: 'amount'
  },
  {
    name: 'Date de début',
    value: 'startDate'
  },
  {
    name: 'Date de fin',
    value: 'endDate'
  },
  {
    name: "Nombre d'utilisations",
    value: 'currentUses'
  }
]

const filterPromotionCodesByGroup = (
  groups: any,
  now: Timestamp
): GetPromotionCodesVM => {
  const promotionCodeStore = usePromotionCodeStore()
  const promotionCodes = promotionCodeStore.items
  const headers = promotionCodesVMHeaders
  const res: GetPromotionCodesVM = {
    isLoading: promotionCodeStore.isLoading,
    items: {}
  }
  groups.forEach((group: any) => {
    const filteredItems: Array<PromotionCode> = promotionCodes.filter(
      group.filter(now)
    )
    const items: Array<GetPromotionCodesItemVM> = filteredItems.map(
      (p: PromotionCode): GetPromotionCodesItemVM => {
        let amount = ''
        if (p.reductionType === ReductionType.Percentage) {
          amount = percentFormatter(p.amount)
        } else {
          const formatter = priceFormatter('fr-FR', 'EUR')
          amount = formatter.format(p.amount / 100)
        }
        return {
          uuid: p.uuid,
          code: p.code,
          amount,
          startDate: p.startDate
            ? timestampToLocaleString(p.startDate, 'fr-FR')
            : '',
          startDatetime: new Date(p.startDate || ''),
          endDate: p.endDate ? timestampToLocaleString(p.endDate, 'fr-FR') : '',
          endDatetime: new Date(p.endDate || ''),
          currentUses: p.currentUses
        }
      }
    )
    res.items[group.name] = {
      count: items.length,
      table: {
        headers,
        items
      }
    }
  })
  return res
}
