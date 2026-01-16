import type { LoyaltyTransaction } from '@core/entities/loyaltyTransaction'
import type { DateProvider } from '@core/gateways/dateProvider'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { timestampToLocaleString } from '@utils/formatters'

export interface CustomerLoyaltyTransactionVM {
  uuid: string
  orderUuid: string
  points: number
  eligibleAmountFormatted: string
  earnedAtFormatted: string
  expiresAtFormatted: string
  isExpired: boolean
}

export interface CustomerLoyaltyVM {
  totalPoints: number
  activePoints: number
  expiredPoints: number
  transactions: CustomerLoyaltyTransactionVM[]
  hasTransactions: boolean
  isLoading: boolean
}

export const getCustomerLoyaltyVM = (
  dateProvider: DateProvider
): CustomerLoyaltyVM => {
  const loyaltyStore = useLoyaltyStore()
  const loyalty = loyaltyStore.customerLoyalty

  if (!loyalty) {
    return {
      totalPoints: 0,
      activePoints: 0,
      expiredPoints: 0,
      transactions: [],
      hasTransactions: false,
      isLoading: loyaltyStore.isLoading
    }
  }

  return {
    totalPoints: loyalty.totalPoints,
    activePoints: loyalty.activePoints,
    expiredPoints: loyalty.totalPoints - loyalty.activePoints,
    transactions: loyalty.transactions.map((t) => mapTransactionToVM(t)),
    hasTransactions: loyalty.transactions.length > 0,
    isLoading: loyaltyStore.isLoading
  }
}

const mapTransactionToVM = (
  transaction: LoyaltyTransaction
): CustomerLoyaltyTransactionVM => {
  return {
    uuid: transaction.uuid,
    orderUuid: transaction.orderUuid,
    points: transaction.points,
    eligibleAmountFormatted: formatCents(transaction.eligibleAmount),
    earnedAtFormatted: timestampToLocaleString(transaction.earnedAt, 'fr-FR'),
    expiresAtFormatted: timestampToLocaleString(transaction.expiresAt, 'fr-FR'),
    isExpired: transaction.isExpired
  }
}

const formatCents = (cents: number): string => {
  return (cents / 100).toFixed(2) + ' €'
}
