import type { LoyaltyPointsTransaction } from '@core/entities/loyaltyPointsTransaction'
import { TransactionType } from '@core/entities/loyaltyPointsTransaction'
import type { UUID } from '@core/types/types'
import { useLoyaltyStore } from '@store/loyaltyStore'

export interface CustomerLoyaltyItemVM {
  uuid: string
  type: string
  points: string
  orderUuid?: string
  reason?: string
  expiresAt?: string
  createdAt: string
}

export interface CustomerLoyaltyVM {
  balance: number
  items: Array<CustomerLoyaltyItemVM>
  isLoading: boolean
}

const transactionTypeLabels: Record<string, string> = {
  [TransactionType.Earned]: 'Gagné',
  [TransactionType.ManualCredit]: 'Crédit manuel',
  [TransactionType.Expired]: 'Expiré'
}

const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}

const formatPoints = (transaction: LoyaltyPointsTransaction): string => {
  if (transaction.type === TransactionType.Expired) {
    return `-${transaction.points}`
  }
  return `+${transaction.points}`
}

const toItemVM = (
  transaction: LoyaltyPointsTransaction
): CustomerLoyaltyItemVM => ({
  uuid: transaction.uuid,
  type: transactionTypeLabels[transaction.type],
  points: formatPoints(transaction),
  orderUuid: transaction.orderUuid,
  reason: transaction.reason,
  expiresAt: transaction.expiresAt
    ? formatDate(transaction.expiresAt)
    : undefined,
  createdAt: formatDate(transaction.createdAt)
})

export const getCustomerLoyaltyVM = (customerUuid: UUID): CustomerLoyaltyVM => {
  const loyaltyStore = useLoyaltyStore()
  const customerLoyalty = loyaltyStore.customerLoyalty[customerUuid]

  if (!customerLoyalty) {
    return {
      balance: 0,
      items: [],
      isLoading: loyaltyStore.isLoading
    }
  }

  return {
    balance: customerLoyalty.balance,
    items: customerLoyalty.transactions.map(toItemVM),
    isLoading: loyaltyStore.isLoading
  }
}
