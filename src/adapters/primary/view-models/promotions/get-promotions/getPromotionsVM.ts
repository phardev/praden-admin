import { TableVM } from '@adapters/primary/view-models/invoices/get-invoice/getInvoiceVM'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import {
  isPromotionEnded,
  isPromotionInProgress,
  isPromotionStarted,
  Promotion,
  ReductionType
} from '@core/entities/promotion'
import { DateProvider } from '@core/gateways/dateProvider'
import { HashTable, Timestamp } from '@core/types/types'
import { PromotionListItem } from '@core/usecases/promotions/promotions-listing/promotionListItem'
import { usePromotionStore } from '@store/promotionStore'
import {
  percentFormatter,
  priceFormatter,
  timestampToLocaleString
} from '@utils/formatters'

export interface GetPromotionItemVM {
  uuid: string
  name: string
  amount: string
  startDate: string
  startDatetime: Date
  endDate: string
  endDatetime: Date
  numberOfProducts: number
}

interface GetPromotionsGroupVM {
  count: number
  table: TableVM<GetPromotionItemVM>
}

export type GetPromotionsVM = HashTable<GetPromotionsGroupVM>

const getPromotionsVMHeaders: Array<Header> = [
  {
    name: 'Nom',
    value: 'name'
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
    name: 'Nombre de produits',
    value: 'numberOfProducts'
  }
]

const inProgressFilter =
  (now: Timestamp) =>
  (p: Promotion): boolean => {
    return isPromotionInProgress(p, now)
  }

const endedFilter =
  (now: Timestamp) =>
  (p: Promotion): boolean => {
    return isPromotionEnded(p, now)
  }

const incomingFilter =
  (now: Timestamp) =>
  (p: Promotion): boolean => {
    return !isPromotionStarted(p, now)
  }

const filterPromotionsByGroup = (
  groups: any,
  now: Timestamp
): GetPromotionsVM => {
  const promotionStore = usePromotionStore()
  const promotions = promotionStore.items
  const headers = getPromotionsVMHeaders
  const res: GetPromotionsVM = {}
  groups.forEach((group: any) => {
    const filteredItems: Array<PromotionListItem> = promotions.filter(
      group.filter(now)
    )
    const items: Array<GetPromotionItemVM> = filteredItems.map(
      (p: PromotionListItem): GetPromotionItemVM => {
        let amount = ''
        if (p.type === ReductionType.Percentage) {
          amount = percentFormatter(p.amount)
        } else {
          const formatter = priceFormatter('fr-FR', 'EUR')
          amount = formatter.format(p.amount / 100)
        }
        return {
          uuid: p.uuid,
          name: p.name,
          amount,
          startDate: p.startDate
            ? timestampToLocaleString(p.startDate, 'fr-FR')
            : '',
          startDatetime: new Date(p.startDate || ''),
          endDate: p.endDate ? timestampToLocaleString(p.endDate, 'fr-FR') : '',
          endDatetime: new Date(p.endDate || ''),
          numberOfProducts: p.productCount
        }
      }
    )
    res[group.name] = {
      count: items.length,
      table: {
        headers,
        items
      }
    }
  })
  return res
}

export const getPromotionsVM = (
  dateProvider: DateProvider
): GetPromotionsVM => {
  const groups = [
    {
      name: 'En cours',
      filter: inProgressFilter
    },
    {
      name: 'Terminée',
      filter: endedFilter
    },
    {
      name: 'À venir',
      filter: incomingFilter
    }
  ]
  return filterPromotionsByGroup(groups, dateProvider.now())
}
