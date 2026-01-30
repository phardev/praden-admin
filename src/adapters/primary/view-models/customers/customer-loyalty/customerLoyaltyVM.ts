import type { LoyaltyTransaction } from '@core/entities/loyaltyTransaction'
import { LoyaltyTransactionType } from '@core/entities/loyaltyTransaction'
import { useCustomerStore } from '@store/customerStore'

export interface LoyaltyHistoryItemVM {
  uuid: string
  points: number
  type: (typeof LoyaltyTransactionType)[keyof typeof LoyaltyTransactionType]
  orderUuid?: string
  expiresAt?: string
  createdAt: string
  formattedDate: string
  formattedExpiresAt?: string
  isPositive: boolean
}

export interface CustomerLoyaltyVM {
  balance: number
  history: Array<LoyaltyHistoryItemVM>
  hasHistory: boolean
}

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate)
  const day = date.getUTCDate().toString().padStart(2, '0')
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
  const year = date.getUTCFullYear()
  return `${day}/${month}/${year}`
}

const isPositiveTransaction = (transaction: LoyaltyTransaction): boolean => {
  if (transaction.type === LoyaltyTransactionType.Earned) {
    return true
  }
  if (transaction.type === LoyaltyTransactionType.Redeemed) {
    return false
  }
  if (transaction.type === LoyaltyTransactionType.Expired) {
    return false
  }
  return transaction.points > 0
}

const mapToHistoryItem = (
  transaction: LoyaltyTransaction
): LoyaltyHistoryItemVM => ({
  uuid: transaction.uuid,
  points: transaction.points,
  type: transaction.type,
  orderUuid: transaction.orderUuid,
  expiresAt: transaction.expiresAt,
  createdAt: transaction.createdAt,
  formattedDate: formatDate(transaction.createdAt),
  formattedExpiresAt: transaction.expiresAt
    ? formatDate(transaction.expiresAt)
    : undefined,
  isPositive: isPositiveTransaction(transaction)
})

const sortByDateDescending = (
  a: LoyaltyTransaction,
  b: LoyaltyTransaction
): number => {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
}

export const customerLoyaltyVM = (): CustomerLoyaltyVM => {
  const customerStore = useCustomerStore()
  const customer = customerStore.current

  const history = customer?.loyaltyPointsHistory ?? []
  const sortedHistory = [...history].sort(sortByDateDescending)

  return {
    balance: customer?.loyaltyPointsBalance ?? 0,
    history: sortedHistory.map(mapToHistoryItem),
    hasHistory: history.length > 0
  }
}
