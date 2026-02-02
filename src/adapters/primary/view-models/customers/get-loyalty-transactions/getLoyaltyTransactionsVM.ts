import type {
  LoyaltyTransaction,
  LoyaltyTransactionType
} from '@core/entities/loyaltyTransaction'
import type { Timestamp, UUID } from '@core/types/types'
import { useLoyaltyStore } from '@store/loyaltyStore'

export interface LoyaltyTransactionItemVM {
  uuid: UUID
  points: number
  type: LoyaltyTransactionType
  orderUuid?: UUID
  reason?: string
  createdAt: Timestamp
}

export interface GetLoyaltyTransactionsVM {
  items: Array<LoyaltyTransactionItemVM>
  isLoading: boolean
  balance: number
  expiringPoints: number
  expiringDate?: Timestamp
}

const sortTransactionsByDateDescending = (
  transactions: Array<LoyaltyTransaction>
): Array<LoyaltyTransaction> => {
  return [...transactions].sort((a, b) => b.createdAt - a.createdAt)
}

const mapTransactionToVM = (
  transaction: LoyaltyTransaction
): LoyaltyTransactionItemVM => ({
  uuid: transaction.uuid,
  points: transaction.points,
  type: transaction.type,
  orderUuid: transaction.orderUuid,
  reason: transaction.reason,
  createdAt: transaction.createdAt
})

export const getLoyaltyTransactionsVM = (): GetLoyaltyTransactionsVM => {
  const loyaltyStore = useLoyaltyStore()

  return {
    items: sortTransactionsByDateDescending(loyaltyStore.transactions).map(
      mapTransactionToVM
    ),
    isLoading: loyaltyStore.isLoading,
    balance: loyaltyStore.balance,
    expiringPoints: loyaltyStore.expiringPoints,
    expiringDate: loyaltyStore.expiringDate
  }
}
